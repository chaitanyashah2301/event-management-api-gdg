
import { prisma } from "../lib/prisma";

export const registerForEvent = async (
  userId: number,
  eventId: number
) => {
  return prisma.$transaction(
    async (tx) => {
    
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const existingRegistration =
        await tx.registration.findUnique({
          where: {
            userId_eventId: {
              userId,
              eventId,
            },
          },
        });

      if (existingRegistration) {
        throw new Error("Already registered for this event");
      }

      const registrationCount = await tx.registration.count({
        where: { eventId },
      });


      if (registrationCount >= event.capacity) {
        throw new Error("Event is full");
      }


      return tx.registration.create({
        data: {
          userId,
          eventId,
        },
      });
    },
    {
      isolationLevel: "Serializable",
    }
  );
};

export const unregisterFromEvent = async (
  userId: number,
  eventId: number
) => {
  const registration = await prisma.registration.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  return prisma.registration.delete({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });
};

export const getMyRegistrations = async (userId: number) => {
  return prisma.registration.findMany({
    where: { userId },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
