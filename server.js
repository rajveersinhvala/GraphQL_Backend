import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./schema.js";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_TOKEN, MONGO_URI } from "./config.js";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected DB");
  })
  .catch((e) => {
    console.log("Error connecting", e);
  });

// import Models
import "./models/User.js";
import "./models/Quotes.js";

import resolvers from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = Jwt.verify(authorization, JWT_TOKEN);
      return { userId };
    }
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log("🚀 ~ file: server.js:47 ~ server.listen ~ url:", url);
});
