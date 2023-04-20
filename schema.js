import { gql } from "apollo-server";
const typeDefs = gql`
  type Query {
    users: [User]
    quotes: [Quote]
    user(_id: ID!): User
    iquote(by: ID!): [Quote]
  }
  type User {
    _id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    quotes: [Quote]
  }
  type Quote {
    name: String
    by: ID!
  }
  type Token {
    token: String!
  }
  type Mutation {
    signupuser(userNew: UserInput!): User
    signinuser(usersingin: UserSigninInput!): Token
    createQuote(name: String!): String
  }
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }
  input UserSigninInput {
    email: String!
    password: String!
  }
`;
export default typeDefs;
