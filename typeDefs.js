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
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comments]
    createdAt: String
  }

  type Comments {
    text: String
    author: User
    createdAt: String
  }

  type Query {
    me: User
  }
`;
