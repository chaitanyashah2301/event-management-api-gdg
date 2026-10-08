import express from "express";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import eventRoutes from "./routes/event.routes";
import registrationRoutes from "./routes/registration.routes";

const app = express();
app.use(express.json());
app.use("/api/registrations", registrationRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/events", eventRoutes);
app.use(errorHandler);


export default app;