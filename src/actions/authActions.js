import apiClient from "../utilits/apiClient";
import apiPaths from "../utilits/apiPaths";

export const loginSuccess = (user) => ({
  type: 'LOGIN_SUCCESS',
  payload: user,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const login = (credentials) => async (dispatch) => {
  try {
      const response = await apiClient.post(apiPaths.login, credentials);
      const { auth_token } = response.data;
      localStorage.setItem('authToken', auth_token);

      const userResponse = await apiClient.get(apiPaths.users + 'me/', {
       headers: { Authorization: `Bearer ${auth_token}` }
      });
      dispatch(loginSuccess(userResponse.data));
  } catch (error) {
      console.error('Login failed', error);
      throw error;
  }
};

export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('authToken');
  if (token) {
      try {
       const userResponse = await apiClient.get(apiPaths.users + 'me/', {
          headers: { Authorization: `Bearer ${token}` }
       });
       dispatch(loginSuccess(userResponse.data));
      } catch (error) {
       console.error('Failed to authenticate', error);
       dispatch(logout());
      }
  }
};
  
  export const logoutUser = () => async (dispatch) => {
  try {
      await apiClient.post(apiPaths.logout);
      localStorage.removeItem('authToken');
      dispatch(logout());
  } catch (error) {
      console.error('Logout failed', error);
      throw error;
  }
};

export const setFiles = (files) => ({
  type: 'SET_FILES',
  payload: files,
});

export const clearFiles = () => ({
  type: 'CLEAR_FILES',
});