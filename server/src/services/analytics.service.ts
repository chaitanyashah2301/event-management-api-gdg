import { prisma } from "../lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

export const getOverview = async () => {
  const now = new Date();
  const since = new Date(now.getTime() - 29 * DAY_MS);
  since.setUTCHours(0, 0, 0, 0);

  const [totalUsers, events, perDayRaw] = await Promise.all([
    prisma.user.count(),
    prisma.event.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        capacity: true,
        dateTime: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { dateTime: "asc" },
    }),
    prisma.$queryRaw<{ day: Date; count: number }[]>`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::int AS count
      FROM "Registration"
      WHERE "createdAt" >= ${since}
      GROUP BY 1
      ORDER BY 1`,
  ]);

  const perEvent = events.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    dateTime: e.dateTime,
    capacity: e.capacity,
    registered: e._count.registrations,
    fillRate: e.capacity > 0 ? e._count.registrations / e.capacity : 0,
  }));

  const totalRegistrations = perEvent.reduce((sum, e) => sum + e.registered, 0);
  const totalCapacity = perEvent.reduce((sum, e) => sum + e.capacity, 0);

  // Fill missing days with zero so the chart has no gaps (days are in UTC).
  const counts = new Map(
    perDayRaw.map((r) => [new Date(r.day).toISOString().slice(0, 10), r.count])
  );
  const registrationsPerDay = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(since.getTime() + i * DAY_MS).toISOString().slice(0, 10);
    return { date, count: counts.get(date) ?? 0 };
  });

  const byCategory = new Map<string, number>();
  for (const e of perEvent) {
    const key = e.category.toUpperCase();
    byCategory.set(key, (byCategory.get(key) ?? 0) + e.registered);
  }

  return {
    totals: {
      users: totalUsers,
      events: perEvent.length,
      registrations: totalRegistrations,
      upcomingEvents: perEvent.filter((e) => e.dateTime >= now).length,
      overallFillRate: totalCapacity > 0 ? totalRegistrations / totalCapacity : 0,
    },
    registrationsPerDay,
    topEvents: [...perEvent].sort((a, b) => b.registered - a.registered).slice(0, 5),
    nearlyFull: perEvent.filter((e) => e.dateTime >= now && e.fillRate >= 0.8),
    byCategory: [...byCategory].map(([category, registrations]) => ({ category, registrations })),
  };
};