import { Request, Response } from "express";
import Contact from "../models/contact";

const getContact = async (req: Request, res: Response) => {
  try {
    const currentContact = await Contact.findOne({ _id: req.userId });
    if (!currentContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(currentContact);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const createContact = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existinContact = await Contact.findOne({ auth0Id });

    if (existinContact) {
      return res.status(200).send();
    }

    const newContact = new Contact(req.body);
    await newContact.save();

    res.status(201).json(newContact.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export default {
  getContact,
  createContact,
};
