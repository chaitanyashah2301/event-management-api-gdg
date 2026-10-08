import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if (error.message === "Event not found") {
        return res.status(404).json({
            error: "Event not found",
        });
    }

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
    if (error.message === "Already registered for this event") {
        return res.status(409).json({
            error: "Already registered for this event",
        });
    }

    if (error.message === "Event is full") {
        return res.status(409).json({
            error: "Event is full",
        });
    }

    if (error.message === "Registration not found") {
        return res.status(404).json({
            error: "Registration not found",
        });
    }

    res.status(500).json({
        error: "Internal server error",
    });

};