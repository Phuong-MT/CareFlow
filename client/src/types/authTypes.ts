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
  
  interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: User;
  }
  export type { User, AuthState, LoginPayload, LoginResponse };