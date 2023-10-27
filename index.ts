import express from "express";
import userRouter from "./routes/user";
import authRouter, { verifyToken } from "./routes/auth";
import postRouter from "./routes/post";

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);

app.get("/", (req, res) => {
  const body = req.body;

  // console.log(body);

  return res.json("Hello Express!");
});

app.post("/test", verifyToken, (req: any, res) => {
  console.log(req.account);

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port: ${port}`);
});
