
import { Request, Response, NextFunction } from "express";
import * as registrationService from "../services/registration.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const eventId = Number(req.params.id);

    const registration =
      await registrationService.registerForEvent(
        userId,
        eventId
      );

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

export const unregister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const eventId = Number(req.params.id);

    await registrationService.unregisterFromEvent(
      userId,
      eventId
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getMine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const registrations =
      await registrationService.getMyRegistrations(userId);

    res.status(200).json(registrations);
  } catch (error) {
    next(error);
  }
};
