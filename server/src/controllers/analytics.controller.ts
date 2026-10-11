import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";

export const overview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await analyticsService.getOverview());
  } catch (error) {
    next(error);
  }
};