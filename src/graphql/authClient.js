import { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';
import { API_URL } from 'app/constants/ApiData';

export const useAuthClient = (token) => {
  try {
    const [idToken, setIdToken] = useState('');

    useEffect(() => {
      try {
        if (window?.gapi?.auth2?.getAuthInstance()?.currentUser?.get()?.getAuthResponse()?.id_token) {
          const token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
          return setIdToken(token);
        }

        if (localStorage.getItem('token')) {
          const token = localStorage.getItem('token');
          return setIdToken(token);
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }, []);

    return new GraphQLClient(API_URL, {
      headers: { authorization: idToken },
    });
  } catch (error) {
    console.error(error);
  }
};
