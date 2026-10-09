import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
// import { error } from "node:console";

export const registerUser = async (
    name: string,
    email: string,
    password: string
) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
        },
    });

    const token = generateToken(user.id);


    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await comparePassword(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const  getCurrentUser = async (userId:number)=>{
  const user = await prisma.user.findUnique({
    where:{
      id:userId,
    },
    select:{
            id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  if(!user){
    throw new Error("User not found");
  }

  return user;
};

// User sends name/email/password
//           ↓
// auth.service.ts
//           ↓
// Check if email already exists
//           ↓
// Hash password
//           ↓
// Save user in PostgreSQL
//           ↓
// Create JWT
//           ↓
// Return user + token