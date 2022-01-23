export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'beta-get-party.herokuapp.com'
    : 'localhost:4000';

export const WS_URL =
  process.env.NODE_ENV === 'production'
    ? `wss://${BASE_URL}/graphql`
    : `ws://${BASE_URL}/graphql`;

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? `https://${BASE_URL}/graphql`
    : `http://${BASE_URL}/graphql`;
