import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Redis } from "ioredis";
import { HelloResolver } from "../resolvers/hello";
import { PostResolver } from "../resolvers/post";
import { UserResolver } from "../resolvers/user";
import { createUpdootLoader } from "../utils/createUpdootLoader";
import { createUserLoader } from "../utils/createUserLoader";
import { Express } from "express";

export const initializeApollo = async (app: Express, redis: Redis) => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: process.env.CORS_ORIGIN,
    }
  });

  return app;
};
