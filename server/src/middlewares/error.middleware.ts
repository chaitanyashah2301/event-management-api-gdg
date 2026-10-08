import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error.message === "User already exists") {
    return res.status(409).json({
      error: "User already exists",
    });
  }

  if (error.message === "Invalid email or password") {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  if (error.message === "User not found") {
    return res.status(404).json({
      error: "User not found",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
};