"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/config";
import { register } from "@/store/authSlide";

const registerSchema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .regex(/[a-zA-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số.")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
  tenantCode:z.string().min(2, "Mã tổ chức ít nhất 2 ký tự"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {user, status, error} = useAppSelector((state)=> state.user)
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log(data)
      await dispatch(register(data));
     router.push('/')
    } catch (error) {
      console.error(error);
    } 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CareFlow
          </h1>
          <p className="text-gray-600">
            Đăng kí vào tài khoản CareFlow của bạn
          </p>
        </div>
  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Input
            label="Full Name"
            {...formRegister("name")}
            error={errors.name?.message}
            placeholder="John Doe"
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            {...formRegister("email")}
            error={errors.email?.message}
            placeholder="name@example.com"
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            {...formRegister("password")}
            error={errors.password?.message}
            placeholder="••••••••"
          />
          
          {/* Confirm Password */}
          <Input
            label="Tenant Code"
            type="text"
            {...formRegister("tenantCode")}
            error= {errors.tenantCode?.message}
            placeholder="Mã công ty"
          />
          {/* Submit Button */}
          <Button type="submit"  className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
