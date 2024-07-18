import api from './api';


// Function to store the authentication token in localStorage
export const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Token ${token}`; // Set token in Axios headers
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  };
  
  // Function to log in a user and obtain a token
  export const loginUser = async (username: string, password: string): Promise<number> => {
    try {
      const response = await api.post<{ token: string; user_id: number }>('login/', { username, password });
      const { token, user_id } = response.data;
      setAuthToken(token); // Store the token in localStorage and set Axios headers
      return user_id; // Return user ID or other relevant data
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };
  
  // Function to sign up a user
  export const signupUser = async (email: string, password: string): Promise<void> => {
    try {
      await api.post('signup/', { email, password });
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    }
  };
  
  // Function to log out a user
  export const logoutUser = () => {
    setAuthToken(null); // Clear token from localStorage and Axios headers
  };
  
  export default api;