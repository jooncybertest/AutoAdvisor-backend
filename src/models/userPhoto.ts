import mongoose from "mongoose";

const userPhotoSchema = new mongoose.Schema(
  {
    auth0Id: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
    },
  },
  { timestamps: true }
);

const userPhoto = mongoose.model("userPhoto", userPhotoSchema);

export default userPhoto;
