import express from "express";
import { PrismaClient } from "@prisma/client";

import { verifyToken } from "./auth";

const router = express.Router();

const client = new PrismaClient();

// 글작성
router.post("/", verifyToken, async (req: any, res) => {
  try {
    const { content } = req.body;
    const { account } = req;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Not exist content.",
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

    const post = await client.post.create({
      data: {
        content,
        userId: user.id,
      },
    });

    return res.json({ ok: true, post });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Server error.",
    });
  }
});

export default router;
