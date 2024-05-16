import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  modelYear: {
    type: String,
  },
  plantCountry: {
    type: String,
  },
  plantState: {
    type: String,
  },
  plantCity: {
    type: String,
  },
  plantCompanyName: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  engineCylinders: {
    type: Number,
  },
  engineConfiguration: {
    type: String,
  },
  fuelTypePrimary: {
    type: String,
  },
  transmissionStyle: {
    type: String,
  },
  vinNumber: {
    type: String,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
