import express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"





const prisma = new PrismaClient();


router.get("/signup", function (req, res, next) {
  const data = {
    title: "Users/signup",
    content: "名前とパスワードを入力ください",
    finish: "新規登録"
  };
  return res.status(200).json({ data });
});

router.post("/signup", async function (req, res) {
  try {
    const { name, password, email } = req.body;

    // ランダムな salt を生成
    const salt = crypto.randomBytes(16).toString('hex');

    // パスワードと salt を組み合わせてハッシュ化
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    // ユーザーアカウントを作成
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
        salt
      },
    });

    const data = {
      message: "User account created successfully",
      user,
    };

    return res.status(201).json({ data });
  } catch (error) {
    console.error("Error creating user account:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 認証処理の実装
passport.use(new LocalStrategy(
    {usernameField: "name", passwordField: "password"},
    async (username, password, cb) => {
      try {
        const user = await prisma.user.findUnique({
          where: {name: username}
        });
        if (!user) {
          // 指定されたユーザがデータベースにない場合
          return cb(null, false, {message: "ユーザ名かパスワードが違います"});
        }
        // パスワードのハッシュ化
        const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
        // 計算したハッシュ値と、データベースに保存されているハッシュ値の比較
        if (hashedPassword !== user.password) {
          // パスワードが間違っている場合
          return cb(null, false, {message: "ユーザ名かパスワードが違います"});
        }
        // ユーザもパスワードも正しい場合
        return cb(null, user);
      } catch (e) {
        return cb(e);
      }
    }
));

// ユーザ情報をセッションに保存するルールの定義
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {id: user.id, name: user.name});
  });
});

// セッションからユーザ情報を復元するルールの定義
passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

router.get("/login", (req, res, next) => {
  const data = {
    title: "Users/Login",
    content: "名前とパスワードを入力ください"
  };
  res.render("users/login", data);
});

router.post("/login", passport.authenticate("local", {
  successReturnToOrRedirect: "/",
  failureRedirect: "/users/login",
  failureFlash: true // エラーメッセージを表示するために追加
}));

export default router;




