import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const client = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        ok: true,
        message: "Not exist data.",
      });
    }

    //유저가 존재하는지 확인
    const existUser = await client.user.findUnique({
      where: {
        account, //key랑 value값이 같으면 생략해도됨. account: account,
        //유저가 존재하지않으면 null값이 나옴.
      },
    });

    //있으면 리턴(종료)
    if (existUser) {
      return res
        .status(400)
        .json({ ok: false, message: "Already exist user." });
    }
    //10이라는 숫자는 높을수록 보안성은 높아지지만 연산속도가 느려져서 10이적당

    const hashedPassword = bcrypt.hashSync(password, 10);

    //없으면 생성
    await client.user.create({
      data: {
        account,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/test", async (req, res) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        ok: false,
        message: "Not exist data.",
      });
    }

    const user = await client.user.findUnique({
      where: {
        account,
      },
    });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Not exist user.",
      });
    }

    const result = bcrypt.compareSync(password, user.password);

    if (!result) {
      return res.status(400).json({
        ok: false,
        message: "Not correct password.",
      });
    }

    const token = jwt.sign({ account }, process.env.JWT_SECRET_KEY!);

    return res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;
