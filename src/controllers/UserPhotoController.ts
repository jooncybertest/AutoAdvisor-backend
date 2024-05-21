import { Request, Response } from "express";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import sharp from "sharp";
import userPhoto from "../models/userPhoto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey as string,
    secretAccessKey: secretAccessKey as string,
  },
  region: bucketRegion as string,
});

const getUserPhoto = async (req: Request, res: Response) => {
  try {
    const currentPhoto = await userPhoto.findOne({ auth0Id: req.userId });
    if (!currentPhoto) {
      const defaultImagePath = path.join(
        __dirname,
        "../../assets/defaultProfileImage.jpg"
      );
      res.setHeader("Content-Type", "image/jpeg");
      return res.sendFile(defaultImagePath);
    }
    const getObjectParams = {
      Bucket: bucketName,
      Key: currentPhoto.imageName as string,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({ ...currentPhoto.toObject(), imageUrl: url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createUserPhoto = async (req: Request, res: Response) => {
  const { auth0Id } = req.body;
  console.log("req.body", req.body);
  console.log("req.file", req.file);

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 150, width: 150, fit: "contain" })
      .toBuffer();

    const imageName = randomImageName();
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);

    await s3.send(command);

    let userPhotoDoc = await userPhoto.findOne({ auth0Id });

    if (userPhotoDoc) {
      userPhotoDoc.imageName = imageName;
      await userPhotoDoc.save();
    } else {
      userPhotoDoc = new userPhoto({
        auth0Id,
        imageName,
      });
      await userPhotoDoc.save();
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: imageName,
    };

    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    res.status(200).json({
      message: "Image updated successfully.",
      data: { ...userPhotoDoc.toObject(), imageUrl: url },
    });
  } catch (error) {
    console.error("Error processing image", error);
    res.status(500).send("Internal server error.");
  }
};

const updateUserPhoto = async (req: Request, res: Response) => {
  const { auth0Id } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 150, width: 150, fit: "contain" })
      .toBuffer();

    const imageName = randomImageName();
    const params = {
      Bucket: bucketName,
      Key: imageName,
      Body: buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);

    await s3.send(command);

    let userPhotoDoc = await userPhoto.findOne({ auth0Id });

    if (!userPhotoDoc) {
      return res.status(404).send("User photo not found.");
    }

    userPhotoDoc.imageName = imageName;
    await userPhotoDoc.save();

    const getObjectParams = {
      Bucket: bucketName,
      Key: imageName,
    };

    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

    res.status(200).json({
      message: "Image updated successfully.",
      data: { ...userPhotoDoc.toObject(), imageUrl: url },
    });
  } catch (error) {
    console.error("Error processing image", error);
    res.status(500).send("Internal server error.");
  }
};

export default {
  getUserPhoto,
  createUserPhoto,
  updateUserPhoto,
};
