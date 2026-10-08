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

export const getAllEvents = async () => {
  return prisma.event.findMany({
    orderBy: {
      dateTime: "asc",
    },
  });
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