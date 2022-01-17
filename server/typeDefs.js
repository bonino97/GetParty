const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
    createdAt: String
  }

  type Pin {
    _id: ID
    createdAt: String
    title: String
    image: String
    content: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comments]
  }

  input CreatePinInput {
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
  }

  type Comments {
    text: String
    author: User
    createdAt: String
  }

  type Query {
    me: User
    getPins: [Pin!]!
  }

  type Mutation {
    createPin(input: CreatePinInput!): Pin
    deletePin(pinId: ID!): Pin
    createComment(pinId: ID!, text: String!): Pin
  }
`;
