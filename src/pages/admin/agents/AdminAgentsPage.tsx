import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  SearchOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../../../api/users";
import { User } from "../../../types";
import UserDetailsModal from "./UserDetailsModal";
import CreateUserModal from "./CreateUserModal";
import {
  Table,
  Input,
  Space,
  Button,
  Card,
  Spin,
  Typography,
  Avatar,
  Tag,
  Modal,
  Pagination,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { confirm } = Modal;

const AdminAgentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch users
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["users", currentPage, pageSize],
    queryFn: () => getAllUsers(currentPage, pageSize),
  });

  const users = usersResponse?.data;
  const meta = usersResponse?.meta;

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Agent created successfully");
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create agent");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, formData }: { userId: number; formData: FormData }) => updateUser(userId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Agent updated successfully");
      setIsCreateModalOpen(false);
      setEditUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update agent");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Agent deleted successfully");
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete agent");
    },
  });

  const handleCreateOrUpdateUser = (formData: FormData) => {
    if (formData.has("id")) {
      const userId = formData.get("id") as string;
      updateUserMutation.mutate({ userId: userId, formData });
    } else {
      createUserMutation.mutate(formData);
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setIsCreateModalOpen(true);
  };

  const showDeleteConfirm = (user: User) => {
    confirm({
      title: "Are you sure you want to delete this agent?",
      content: `You are about to delete ${user.name}. This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteUserMutation.mutate(user.id!);
      },
    });
  };

  const openUserDetailsModal = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditUser(null);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleTag = (role: User["role"]) => {
    switch (role) {
      case "manager":
        return <Tag color="blue">Manager</Tag>;
      case "customer":
        return <Tag color="green">Customer</Tag>;
      default:
        return <Tag>{role}</Tag>;
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Agent",
      dataIndex: "name",
      key: "name",
      render: (_, user) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<UserOutlined />}
            src={user.imageUrl || undefined}
          />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.45)" }}>
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => getRoleTag(role),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, user) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#1890ff" }} />}
            onClick={() => openUserDetailsModal(user)}
            title="View details"
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#52c41a" }} />}
            onClick={() => handleEditUser(user)}
            title="Edit agent"
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => showDeleteConfirm(user)}
            title="Delete agent"
          />
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Agents Management
          </Title>
        </Space>
        <Space>
          <Input
            placeholder="Search agents..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Agent
          </Button>
        </Space>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin size="large" tip="Loading agents..." />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={filteredUsers || []}
            rowKey="id"
            pagination={false}
            bordered
          />

          {meta && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={meta.totalNoOfPages}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Total ${total} agents`}
                onChange={handlePageChange}
                onShowSizeChange={(current, size) => {
                  setCurrentPage(1);
                  setPageSize(size);
                }}
              />
            </div>
          )}
        </>
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setIsUserDetailsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateOrUpdateUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
        editUser={editUser}
      />
    </Card>
  );
};

export default AdminAgentsPage;
