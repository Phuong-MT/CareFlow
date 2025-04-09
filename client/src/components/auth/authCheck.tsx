"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/stores';
import {clearAuth, setAuth } from '@/store/authSlide';
import { UserRole } from '@/types/authTypes';
import { apiVerifyToken } from '@/services/authServices';

interface AuthCheckProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function AuthCheck({
  children,
  allowedRoles = [],
  redirectTo = '/login',
  fallback,
}: AuthCheckProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, access_token } = useSelector((state: RootState) => state.user);

  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    
    const checkAuth = async () => {
        if (isAuthenticated && access_token) {
            try {
              const response = await apiVerifyToken();
              if(response.status === 200){
                setAuth(response.data);
              }
            } catch (error) {
              console.error("Error verifying token:", error);
              clearAuth();
              router.push(redirectTo);
            } finally {
              setIsValidating(false);
            }
          } else {
            setIsValidating(false);
          }
        };
    checkAuth();
  }, [dispatch, isAuthenticated, user, router, redirectTo]);

  useEffect(() => {
    if (user?.role && allowedRoles.includes(user?.role as UserRole)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [user, allowedRoles]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized && fallback) {
    return <>{fallback}</>;
  }

  return isAuthorized ? <>{children}</> : null;
}
