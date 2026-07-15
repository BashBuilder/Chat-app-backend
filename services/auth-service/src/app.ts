import express, { type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "@/middlewares/error-handler";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((_, res) => {
    res.status(400).json({ message: "Not found" });
  });

  app.use(errorHandler);

  return app;
};
