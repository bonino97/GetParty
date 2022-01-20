export const isAuthUser = (pin, currentUser) =>
  currentUser?._id === pin?.author?._id;
