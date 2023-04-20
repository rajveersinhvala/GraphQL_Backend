import { users, quotes } from "./FakeDb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { JWT_TOKEN } from "./config.js";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

const resolvers = {
  Query: {
    users: async () => await User.find({}),
    quotes: async () => await Quote.find({}),
    user: async (parent, { _id }) => await findOne({ _id }),
    iquote: async (parent, { by }) => await Quote.findOne({ by }),
  },
  User: {
    quotes: async (ur) => await Quote.find({ by: ur._id }),
  },
  Mutation: {
    signupuser: async (parent, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User Exists with this email address");
      }
      const hashpassword = await bcrypt.hash(userNew.password, 12);

      const newuser = new User({
        ...userNew,
        password: hashpassword,
      });

      return await newuser.save();
    },
    signinuser: async (parent, { usersingin }) => {
      const user = await User.findOne({ email: usersingin.email });
      if (!user) {
        throw new Error("User not found");
      }
      const domatch = await bcrypt.compare(usersingin.password, user.password);
      if (!domatch) {
        throw new Error("Invalid Input");
      }
      const token = Jwt.sign({ userId: user._id }, JWT_TOKEN);
      return { token };
    },
    createQuote: async (parent, { name }, { userId }) => {
      if (!userId) throw new Error("You must Login");
      const newQuote = new Quote({
        name,
        by: userId,
      });
      await newQuote.save();
      return "Saved Quote";
    },
  },
};

export default resolvers;
