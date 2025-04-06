import api from '@/utils/axiosConfig';
import {LoginPayload} from '@/types/authTypes';

export const apiLogin = async (payload: LoginPayload) => {
  try {
    const response = await api.post('/users/login', payload);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}