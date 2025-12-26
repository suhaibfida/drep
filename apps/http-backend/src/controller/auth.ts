import { Request, Response } from "express";
import { z } from "zod";
import { user } from "./../model/authModel.js";
import jwt from "jsonwebtoken";
import { signupschema } from "@repo/common/config";
export const signUp = (req: Request, res: Response) => {
  const safeParse = signupschema.safeParse(req.body);
  if (!safeParse.success) {
    console.log("Error in syntax", safeParse.error.issues);
    return res.json({
      message: "error",
    });
  }
};

const login = (req: Request, res: Response) => {
  const secret = "json";
  const { username, password } = req.body;
  const token = jwt.sign({ username }, secret);
  return res.json({
    token,
  });
};
