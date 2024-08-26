import apiClient from "../utilits/apiClient";
import apiPaths from "../utilits/apiPaths";

export const loginSuccess = (user) => ({
  type: 'LOGIN_SUCCESS',
  payload: user,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const login = (credentials) => async(dispatch) => {
  try {
    const response = await apiClient.post(apiPaths.login, credentials);
    const { auth_token, user } = response.data;
    
    localStorage.setItem('authToken', auth_token);
    const userResponse = await apiClient.get(apiPaths.users + user);
    dispatch(loginSuccess(userResponse.data));
  } catch (error) {
    console.error('Login failed', error);
  }
 
};

export const logoutUser = () => (dispatch) => {
  // Здесь вы можете выполнить запрос к API для выхода
  // Например, удалить токен из localStorage
  localStorage.removeItem('user');
  dispatch(logout());
};