import { createContext } from 'react';

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
  currentLocation: null,
  routes: [],
});

export default Context;
