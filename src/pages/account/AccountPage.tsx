import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Typography, Spin, message, Layout } from "antd";
import {
  getCurrentUser,
  updateUserProfile,
  updatePassword,
  deleteAccount,
} from "../../api/users";
import { useAuthStore } from "../../store/authStore";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import DeleteAccountSection from "./DeleteAccountSection";
import { UpdateProfileData, UpdatePasswordData } from "../../types";

const { Title } = Typography;
const { Content } = Layout;

const AccountPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      message.success("Profile updated successfully");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      message.success("Password updated successfully");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update password"
      );
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onSuccess: () => {
      message.success("Account deleted successfully");
      logout();
      navigate("/");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to delete account"
      );
    },
  });

  const handleUpdateProfile = (data: UpdateProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const handleUpdatePassword = (data: UpdatePasswordData) => {
    updatePasswordMutation.mutate(data);
  };

  const handleDeleteAccount = (password: string) => {
    deleteAccountMutation.mutate(password);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Content
      style={{ padding: "0 50px", maxWidth: "1000px", margin: "0 auto" }}
    >
      <Title level={2} style={{ margin: "24px 0" }}>
        Account Settings
      </Title>

      <ProfileSection
        user={user!}
        isLoading={isLoading}
        onUpdateProfile={handleUpdateProfile}
        isUpdating={updateProfileMutation.isPending}
      />

      <PasswordSection
        onUpdatePassword={handleUpdatePassword}
        isUpdating={updatePasswordMutation.isPending}
      />

      <DeleteAccountSection
        onDeleteAccount={handleDeleteAccount}
        isDeleting={deleteAccountMutation.isPending}
      />
    </Content>
  );
};

export default AccountPage;
