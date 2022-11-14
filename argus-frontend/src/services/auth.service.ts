import axios from 'axios';
import { apiUrl } from '../helpers/constants';

const API_URL = `${apiUrl}/api/auth`;

export const authHeader = () => {
  const userStr = localStorage.getItem('user');
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  if (user?.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return { Authorization: '' };
  }
}

export const register = (email: string, password: string) => {
  return axios.post(`${API_URL}/register`, {
    email,
    password,
  });
};

export const login = (email: string, password: string) => {
  return axios
    .post(`${API_URL}/login`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify({
            email, token: response.data.token
          }));
      }

      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);

  return null;
};