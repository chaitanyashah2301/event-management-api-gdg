import { prisma } from "../lib/prisma";

export const createEvent = async (
  title: string,
  description: string,
  dateTime: Date,
  venue: string,
  capacity: number,
  category: string
) => {
  return prisma.event.create({
    data: {
      title,
      description,
      dateTime,
      venue,
      capacity,
      category,
    },
  });
};

export const getAllEvents = async (
  search?: string,
  category?: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const events = await prisma.event.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
    orderBy: {
      dateTime: "asc",
    },
    skip,
    take: limit,
  });

  const total = await prisma.event.count({
    where: {
      AND: [
        search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
  });

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventById = async (id: number) => {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const updateEvent = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    dateTime?: Date;
    venue?: string;
    capacity?: number;
    category?: string;
  }
) => {
  await getEventById(id);

  return prisma.event.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteEvent = async (id: number) => {
  await getEventById(id);

  await prisma.event.delete({
    where: {
      id,
    },
  });
};