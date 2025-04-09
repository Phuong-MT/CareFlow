interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
  
  interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    access_token: string | null;
    refresh_token: string | null;
    isAuthenticated: boolean;
  }
  

  
  interface LoginPayload {
    email: string;
    password: string;
  }
  
  interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    tenantCode: string; 
  }

  interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: User;
  }

  export enum UserRole {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    USER = 'user'
  }
  export type { User, AuthState, LoginPayload, LoginResponse, RegisterPayload};