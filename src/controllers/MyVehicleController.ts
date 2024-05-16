import { Request, Response } from "express";
import Vehicle from "../models/vehicle";

const getCurrentVehicle = async (req: Request, res: Response) => {
  try {
    const currentVehicle = await Vehicle.find({ _id: req.userId });
    if (!currentVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(currentVehicle);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createCurrentVehicle = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingcurrentVehicle = await Vehicle.find({ auth0Id });

    if (existingcurrentVehicle) {
      return res.status(200).send();
    }

    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();

    res.status(201).json(newVehicle.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  createCurrentVehicle,
  getCurrentVehicle,
  deleteVehicle,
};
