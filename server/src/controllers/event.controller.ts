import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/event.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      dateTime,
      venue,
      capacity,
      category,
    } = req.body;

    const event = await eventService.createEvent(
      title,
      description,
      new Date(dateTime),
      venue,
      Number(capacity),
      category
    );

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : undefined;

    const page =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limit =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 10;

    const result = await eventService.getAllEvents(
      search,
      category,
      page,
      limit
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const event = await eventService.getEventById(id);

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const {
      title,
      description,
      dateTime,
      venue,
      capacity,
      category,
    } = req.body;

    const event = await eventService.updateEvent(id, {
      title,
      description,
      dateTime: dateTime ? new Date(dateTime) : undefined,
      venue,
      capacity: capacity !== undefined ? Number(capacity) : undefined,
      category,
    });

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    await eventService.deleteEvent(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};