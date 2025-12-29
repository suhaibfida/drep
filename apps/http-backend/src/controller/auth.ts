import { Request, Response } from "express";
import { z } from "zod";
import { user } from "./../model/authModel.js";
import jwt from "jsonwebtoken";
import { signupschema } from "@repo/common/config";
import { prismaClient } from "@repo/db/db";
export const signUp = async (req: Request, res: Response) => {
  const safeParse = signupschema.safeParse(req.body);
  if (!safeParse.success) {
    console.log("Error in syntax", safeParse.error.issues);
    return res.json({
      message: "error",
    });
  }
  const data = await prismaClient.findFirst({
    where: {
      email: safeParse.data.email,
    },
  });
  if (data) {
    res.json({
      message: "email already taken",
    });
    return;
  }
  const user = prismaClient.user.Create({
    where: {
      username: safeParse.data.username,
      email: safeParse.data.email,
      password: safeParse.data.password,
    },
  });
};

const login = async (req: Request, res: Response) => {
  const secret = "json";
  const { username, password } = req.body;
  const data = await prismaClient.user.findFirst({
    where: {
      username: username,
      password: password,
    },
  });
  if (!data) {
    res.json({
      message: "user not found or credentials invalid",
    });
    return;
  }

  const token = jwt.sign({ userId: data.userId }, secret);
  return res.json({
    token,
  });
};
