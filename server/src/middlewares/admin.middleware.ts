import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const requireAdmin = async (
      req: Request,
  res: Response,
  next: NextFunction
)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user!.id,
            },
            select:{
                role:true,
            },
        });

        if(!user||user.role!=="ADMIN"){
            return res.status(403).json({
                error:"Admin access required",
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};