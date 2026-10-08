export {};
// You can think of this as telling TypeScript:
// "Hey, Express requests have an extra property called user."

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}