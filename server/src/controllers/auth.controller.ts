import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";


export const register = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const {name,email,password} = req.body;
        const result = await authService.registerUser(name,email,password);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const login = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const{email,password}=req.body;
        const result = await authService.loginUser(email,password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const me = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const userId = req.user!.id;
        const user = await authService.getCurrentUser(userId);
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}