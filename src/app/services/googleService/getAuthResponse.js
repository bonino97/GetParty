const idToken = googleUser.getAuthResponse().id_token;
export const client = new GraphQLClient(API_URL, {
  headers: {
    authorization: idToken,
  },
});
