import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import UserPhotoController from "../controllers/UserPhotoController";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", jwtCheck, jwtParse, UserPhotoController.getUserPhoto);

router.get("/default", (req, res) => {
  const defaultImagePath = path.join(
    __dirname,
    "../../assets/defaultProfileImage.jpg"
  );
  res.sendFile(defaultImagePath);
});

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("image"),
  UserPhotoController.createUserPhoto
);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("image"),
  UserPhotoController.updateUserPhoto
);

export default router;
