import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ShopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getBusinesses,
  approveRequest,
  rejectRequest,
  deleteBusiness,
} from "../../../api/businesses";
import { Business } from "../../../types";
import BusinessDetailsModal from "./BusinessDetailsModal";
import { ConfirmationModal } from "./ConfirmationModal";
import {
  Table,
  Input,
  Space,
  Button,
  Badge,
  Card,
  Spin,
  Typography,
  Avatar,
} from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const AdminBusinessesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isBusinessDetailsModalOpen, setIsBusinessDetailsModalOpen] =
    useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [businessToApprove, setBusinessToApprove] = useState<Business | null>(
    null
  );
  const [businessToReject, setBusinessToReject] = useState<Business | null>(
    null
  );

  // Fetch businesses
  const { data: businessesResponse, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => getBusinesses(1, 10),
  });

  const businesses = businessesResponse?.data;
  const meta = businessesResponse?.meta;

  // Approve business mutation
  const approveBusinessMutation = useMutation({
    mutationFn: approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Business approved successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to approve business"
      );
    },
  });

  // Reject business mutation
  const rejectBusinessMutation = useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Business rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject business");
    },
  });

  // Delete business mutation
  const deleteBusinessMutation = useMutation({
    mutationFn: deleteBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Business deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedBusiness(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete business");
    },
  });

  const handleApprove = (business: Business) => {
    setBusinessToApprove(business);
    setBusinessToReject(null);
    setIsConfirmModalOpen(true);
  };

  const confirmApprove = () => {
    if (businessToApprove) {
      approveBusinessMutation.mutate(businessToApprove.id);
    }
    setIsConfirmModalOpen(false);
  };

  const handleReject = (business: Business) => {
    setBusinessToReject(business);
    setBusinessToApprove(null);
    setIsConfirmModalOpen(true);
  };

  const confirmReject = () => {
    if (businessToReject) {
      rejectBusinessMutation.mutate(businessToReject.id);
    }
    setIsConfirmModalOpen(false);
  };

  const openDeleteModal = (business: Business) => {
    setSelectedBusiness(business);
    setIsDeleteModalOpen(true);
  };

  const openBusinessDetailsModal = (business: Business) => {
    setSelectedBusiness(business);
    setIsBusinessDetailsModalOpen(true);
  };

  const filteredBusinesses = businesses?.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Business["status"]) => {
    switch (status) {
      case "pending":
        return <Badge status="warning" text="pending" />;
      case "accepted":
        return <Badge status="success" text="accepted" />;
      case "rejected":
        return <Badge status="error" text="rejected" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const columns: ColumnsType<Business> = [
    {
      title: "Business",
      dataIndex: "name",
      key: "name",
      render: (_, business) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<ShopOutlined />}
          />
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 500 }}>{business.name}</div>
            <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.45)" }}>
              {business.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, business) => (
        <div>
          <div>{business.city}</div>
          <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.45)" }}>
            {business.province}
          </div>
        </div>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      render: (_, business) => (
        <div>
          <div>{business.owner.name}</div>
          <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.45)" }}>
            {business.owner.email}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Registered",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, business) => (
        <Space>
          {business.status === "pending" && (
            <>
              <Button
                type="text"
                icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                onClick={() => handleApprove(business)}
                title="Approve"
              />
              <Button
                type="text"
                icon={<CloseCircleOutlined style={{ color: "#f5222d" }} />}
                onClick={() => handleReject(business)}
                title="Reject"
              />
            </>
          )}
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#1890ff" }} />}
            onClick={() => openBusinessDetailsModal(business)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "#f5222d" }} />}
            onClick={() => openDeleteModal(business)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={3}>Customer Management</Title>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search businesses..."
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%" }}
          allowClear
        />
      </div>

      {/* Businesses Table */}
      <Card style={{ overflowX: "scroll" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBusinesses || []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              total: meta?.totalNoOfPages,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: "No businesses found",
            }}
          />
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedBusiness.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteBusinessMutation.mutate(selectedBusiness.id!)
                }
                disabled={deleteBusinessMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70"
              >
                {deleteBusinessMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Details Modal */}
      {isBusinessDetailsModalOpen && selectedBusiness && (
        <BusinessDetailsModal
          selectedBusiness={selectedBusiness}
          setIsBusinessDetailsModalOpen={setIsBusinessDetailsModalOpen}
        />
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={businessToApprove ? confirmApprove : confirmReject}
        title={businessToApprove ? "Approve Business" : "Reject Business"}
        message={`Are you sure you want to ${
          businessToApprove ? "approve" : "reject"
        } this business? This action cannot be undone.`}
        confirmText={businessToApprove ? "Approve" : "Reject"}
        cancelText="Cancel"
        business={businessToApprove || businessToReject}
        isLoading={
          businessToApprove
            ? approveBusinessMutation.isLoading
            : rejectBusinessMutation.isLoading
        }
      />
    </div>
  );
};

export default AdminBusinessesPage;
