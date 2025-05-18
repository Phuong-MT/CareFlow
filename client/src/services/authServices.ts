import api from '@/utils/axiosConfig';
import {LoginPayload, RegisterPayload} from '@/types/authTypes';
import { PocUser } from '@/types/pocTypes';

export const apiLogin = async (payload: LoginPayload) => {
  try {
    const response = await api.post('/users/login', payload);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
export const apiLoginAdmin = async(payload: LoginPayload) =>{
   try{
    const response = await api.post('/users/login/admin', payload);
    return response;
   }catch(error){
    console.error('Login error:', error);
    throw error;
   }
}

export const apiRegister = async (payload: RegisterPayload) => {
  try {
    console.log(payload)
    const response = await api.post('/users/register', payload);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

export const apiLogout = async ()=>{
  try{
    const response = await api.post('users/logout');
    return response;
  }catch(error){
    console.error('Logout error:', error);
    throw error;
  }
}

export const apiVerifyToken = async () =>{
  try{
    const response = await api.get('users/verify-token');
    return response;
  }catch(error){
    console.error('Verify token error:', error);
    throw error;
  }
  
}
export const apiGetPocUser = async()=>{
  try{
    const response = await api.get<PocUser[]>('/poc-assigment/user')
    return response.data;
  }catch(error){
    console.error("Ger all PocUser error:", error);
    throw error;
  }
}