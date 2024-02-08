// import express from "express";
// import path from "path";
// import cookieParser from "cookie-parser";
// import logger from "morgan";
//
// import indexRouter from "./routes/index.js";
// import usersRouter from "./routes/users.js";
// import cors from "cors";
// import session from "express-session"; // 修正
//
// const app = express();
//
// // ビューエンジンの設定
//
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(import.meta.dirname, "routes")));
// app.use(cors());
// app.use("/", indexRouter);
// app.use("/users" , usersRouter); // マウント先のパスを修正
//
// app.use(session({
//     secret: "eXRyZy9Tp8RJPbkqMOEIc94TW7dzHUIC4WW4+rWB3iEePnje",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 60 * 60 * 1000, httpOnly: false } // セッションの有効期限
// }));
//
//
// const PORT = process.env.PORT || 3031;
//
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// export default app;
//
//

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session"; // セッションを追加
import flash from "connect-flash"; // フラッシュメッセージを追加

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import cors from "cors";
import passport from "passport"; // passportのimportを追加

const app = express();

// ビューエンジンの設定

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(new URL('public', import.meta.url).pathname));
app.use(cors());
app.use("/", indexRouter);
app.use("/users", usersRouter); // マウント先のパスを修正

app.use(session({
    secret: "eXRZy9Tp8RJPbkqMOEIc94TW7dzHUIC4WW4+rWB3iEePnje",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000, httpOnly: false } // セッションの有効期限
}));

// フラッシュメッセージの設定
app.use(flash());

// Passportの初期化
app.use(passport.initialize());
app.use(passport.session());


// 以降のルーターハンドラーの前にフラッシュメッセージをローカル変数に追加するミドルウェアを設定
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

const PORT = process.env.PORT || 3031;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
