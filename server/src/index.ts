import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import { initializeApollo } from "./libs/apollo";
import { initializePostgres } from "./libs/postgres";

const main = () => {
  return Promise.resolve(true);
}

main()
  .then(() => initializePostgres())
  .then(() => express())
  .then((app) => {
    app.set("trust proxy", 1);
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );
    return app;
  })
  .then((app) => {
    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({
          client: redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          sameSite: "lax", // csrf
          secure: __prod__, // cookie only works in https
          domain: __prod__ ? ".codeponder.com" : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
      })
    );

    return { app, redis };
  })
  .then(({ app, redis }) => initializeApollo(app, redis))
  .then((app) => {
    app.listen(parseInt(process.env.PORT), () => {
      console.log(`server started on localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));