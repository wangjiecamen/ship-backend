import express from "express";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = "f32b1ae422cfb2a23153";

const users = [
  {
    username: "admin",
    password: "admin",
  },
];

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(200).json({ message: "无访问权限", code: 403 });
  }
  try {
    const decoded = jsonwebtoken.verify(token, SECRET_KEY);
    req.user = decoded; // 将解码后的用户信息保存在请求中
    next();
  } catch (error) {
    res.status(200).json({ message: "令牌无效或已过期", code: 401 });
  }
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // 查找用户
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(200).json({ message: "用户名或密码错误", code: 400 });
  }

  // 验证密码
  const isPasswordValid = password === user.password;
  if (!isPasswordValid) {
    return res.status(200).json({ message: "用户名或密码错误", code: 400 });
  }

  // 生成JWT令牌
  const token = jsonwebtoken.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    {
      expiresIn: "48h", // 设置令牌有效期
    },
  );
  res
    .status(200)
    .json({ message: "登录成功", code: 200, token, username: user.username });
});
app.get("/", (req, res) => {
	res.send("hello");
});

app.get("/verifyToken", verifyToken, (req, res) => {
  res.status(200).json({
    message: `欢迎你, ${req.user.username}`,
    username: req.user.username,
    code: 200,
  });
});

app.listen(3600, () => console.log(`Server is listening on port 3400`));
