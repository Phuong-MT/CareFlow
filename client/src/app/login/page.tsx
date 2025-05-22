"use client";

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/hooks/config";
import { login, loginAdmin } from '@/store/authSlide';
import { UserRole } from '@/types/authTypes';
// define the schema for validation using zod
const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự').regex(/[a-zA-Z]/,'Mật khẩu phải chứa ít nhất một chữ cái')
  .regex(/[0-9]/,'Mật khẩu phải chứa ít nhất một số.')
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt',
  })
  .trim(),
});

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginMode, setLoginMode] = useState<'admin' | 'user'>('admin');
  const { user, status, error } = useAppSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if(loginMode === 'admin'){
        await dispatch(loginAdmin(data));
        if(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN){
          router.push('/admin');
        }
          else{
          console.log(error)
        }
      }
      else if( loginMode === 'user'){
        await dispatch(login(data));
        if(user?.role === UserRole.USER) router.push('/')
        else if(user?.role === UserRole.POC) router.push('/poc')
        else{
          console.log(error)
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative w-full max-w-md px-6 py-12 mx-auto">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        
        <div className="relative bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-100">
          
          <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {loginMode === 'admin' ? 'Admin Login' : 'User Login'}
            </h1>
            <p className="text-gray-600">
              Đăng nhập vào tài khoản CareFlow của bạn
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="admin"
                checked={loginMode === 'admin'}
                onChange={() => setLoginMode('admin')}
                className="form-radio text-blue-600"
              />
              <span className="text-sm text-gray-700">Admin</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="user"
                checked={loginMode === 'user'}
                onChange={() => setLoginMode('user')}
                className="form-radio text-blue-600"
              />
              <span className="text-sm text-gray-700">User</span>
            </label>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Email"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="name@company.com"
              />
            </div>
            
            <div>
              <Input
                label="Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                placeholder="••••••••"
              />
              <div className="flex justify-end mt-1">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition duration-200">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Button type="submit" variant = "outline" className="w-full">
              Sign in to Account
            </Button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-800 transition duration-200">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}