import { GraphQLClient } from 'graphql-request';

import { API_URL } from 'app/constants/ApiData';

export const useClient = () => {
  return new GraphQLClient(API_URL);
};
