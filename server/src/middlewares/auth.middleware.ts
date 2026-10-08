import {Request,Response,NextFunction} from "express";
import { verifyToken } from "../utils/jwt";
export const authenticate = (
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                error:"Authentication required",
            });
        }
        const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        :null;

        if (!token) {
            return res.status(401).json({
                error:"Invalid authorization header",
            });
        }
        const payload = verifyToken(token);

        req.user={
            id:payload.userId,
        };
        next();

    }catch{
        return res.status(401).json({
            error:"Invalid or expired token",
        });
    }  
};