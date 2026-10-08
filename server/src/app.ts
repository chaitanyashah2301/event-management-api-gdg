import express from "express";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import eventRoutes from "./routes/event.routes";

const app = express();
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/events", eventRoutes);
app.use(errorHandler);


export default app;