// AdminLoginPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { useAuthStore } from "../../../store/authStore";
import { LoginForm } from "./LoginForm";
import { adminLogin } from "../../../api/auth";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      adminLogin(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      notification.success({
        message: "Success",
        description: "Admin login successful!",
      });
      navigate("/admin");
    },
    onError: (error: any) => {
      console.log(error);
      notification.error({
        message: "Login Failed",
        description:
          error.response?.data?.message ||
          "Admin login failed. Please check your credentials.",
      });
    },
  });

  const handleSubmit = (values: { email: string; password: string }) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <LoginForm onSubmit={handleSubmit} loading={loginMutation.isPending} />
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Not an admin?{" "}
            <a href="/" className="text-blue-600 hover:text-blue-800">
              Go to main site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
