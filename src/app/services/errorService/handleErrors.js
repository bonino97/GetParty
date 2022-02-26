export const handleErrors = (err) => {
  const error = JSON.parse(JSON.stringify(err));
  return error?.response?.errors[0];
};
