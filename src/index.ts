import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";
import myVehicleRoute from "./routes/myVehicleRoute";
import contactRoute from "./routes/contactRoute";
import stripeRoute from "./routes/stripeRoute";

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"));

const app = express();
app.use(cors());

app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoute);

app.use("/api/my/vehicle", myVehicleRoute);

app.use("/api/contact", contactRoute);

app.use("/api/create-checkout-session", stripeRoute);

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
