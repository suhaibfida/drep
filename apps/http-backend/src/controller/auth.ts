import { Request, Response } from "express";
import { z } from "zod";
import { user } from "./../model/authModel.js";
import jwt from "jsonwebtoken";
export const signUp = (req: Request, res: Response) => {
  const schema = z.object({
    username: z.string().min(3).max(15),
    email: z.string().min(5).max(15).toLowerCase(),
    password: z.string().min(5).max(15),
  });
  const safeParse = schema.safeParse(req.body);
  if (!safeParse.success) {
    console.log("Error in syntax", safeParse.error.issues);
    return res.json({
      message: "error",
    });
  }
  const check = user.findOne({
    email: safeParse.data.email,
  });
};

const login = (req: Request, res: Response) => {
  const secret = "json";
  const { username, password } = req.body;
  const token = jwt.sign({ username }, secret);
  return res.json({
    token,
  });
};
