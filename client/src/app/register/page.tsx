"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .regex(/[a-zA-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một số.")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    console.log(data)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Input
            label="Full Name"
            {...register("name")}
            error={errors.name?.message}
            placeholder="John Doe"
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="name@example.com"
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="••••••••"
          />

          {/* Submit Button */}
          <Button type="submit" isLoading={loading} className="w-full">
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
