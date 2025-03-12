import React from "react";
import { Modal, Typography, Button, Tag, Space, Row, Col, Avatar } from "antd";
import {
  ShopOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  PhoneOutlined,
  BankOutlined,
  UserOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  NumberOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Business } from "../../../types";

const { Title, Text } = Typography;

interface BusinessDetailsModalProps {
  selectedBusiness: Business;
  setIsBusinessDetailsModalOpen: (isOpen: boolean) => void;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  selectedBusiness,
  setIsBusinessDetailsModalOpen,
}) => {
  // Group the business details into logical sections
  const businessInfo = [
    {
      icon: <ShopOutlined />,
      label: "Business Name",
      value: selectedBusiness.name,
    },
    {
      icon: <BankOutlined />,
      label: "Legal Name",
      value: selectedBusiness.legalName,
    },
    { icon: <MailOutlined />, label: "Email", value: selectedBusiness.email },
    { icon: <PhoneOutlined />, label: "Phone", value: selectedBusiness.phone },
    {
      icon: <CalendarOutlined />,
      label: "Registered On",
      value: selectedBusiness.createdAt
        ? new Date(selectedBusiness.createdAt).toLocaleDateString()
        : undefined,
    },
  ];

  const locationInfo = [
    {
      icon: <HomeOutlined />,
      label: "Address",
      value: selectedBusiness.address,
    },
    {
      icon: <EnvironmentOutlined />,
      label: "City",
      value: selectedBusiness.city,
    },
    {
      icon: <EnvironmentOutlined />,
      label: "Province",
      value: selectedBusiness.province,
    },
    {
      icon: <NumberOutlined />,
      label: "Postal Code",
      value: selectedBusiness.postalCode,
    },
  ];

  const ownerInfo = [
    {
      icon: <UserOutlined />,
      label: "Owner Name",
      value: selectedBusiness.owner?.name,
    },
    {
      icon: <MailOutlined />,
      label: "Owner Email",
      value: selectedBusiness.owner?.email,
    },
    {
      icon: <IdcardOutlined />,
      label: "Owner Role",
      value: selectedBusiness.owner?.role,
    },
    {
      icon: <CalendarOutlined />,
      label: "Owner Joined",
      value: selectedBusiness.owner?.createdAt
        ? new Date(selectedBusiness.owner.createdAt).toLocaleDateString()
        : undefined,
    },
  ];

  // Status tag color mapping
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
  }

  const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
    if (!value) return null;

    return (
      <div className="mb-3">
        <Space>
          <Text type="secondary">{icon}</Text>
          <Text type="secondary">{label}:</Text>
          <Text strong>{value}</Text>
        </Space>
      </div>
    );
  };

  const InfoSection: React.FC<{
    title: string;
    items: Array<{
      icon: React.ReactNode;
      label: string;
      value: string | undefined;
    }>;
  }> = ({ title, items }) => {
    // Check if there's any data to display
    const hasData = items.some((item) => item.value);

    if (!hasData) return null;

    return (
      <div className="mb-6">
        <Title
          level={5}
          className="text-gray-500 mb-3"
          style={{ textTransform: "uppercase", fontSize: "14px" }}
        >
          {title}
        </Title>
        <div className="bg-gray-50 rounded-lg p-4">
          {items.map((item, index) => (
            <InfoItem
              key={index}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={true}
      onCancel={() => setIsBusinessDetailsModalOpen(false)}
      footer={[
        <Button
          key="close"
          onClick={() => setIsBusinessDetailsModalOpen(false)}
        >
          Close
        </Button>,
      ]}
      width={800}
      centered
      title={
        <div className="flex items-center">
          <Avatar
            icon={<ShopOutlined />}
            style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
            size="large"
            className="mr-3"
          />
          <div>
            <span className="text-lg font-medium">{selectedBusiness.name}</span>
            <div className="mt-1">
              <Tag color={getStatusColor(selectedBusiness.status)}>
                {selectedBusiness.status}
              </Tag>
            </div>
          </div>
        </div>
      }
      closeIcon={<CloseOutlined />}
    >
      <div style={{ maxHeight: "70vh", overflow: "auto", padding: "8px 0" }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <InfoSection title="Business Information" items={businessInfo} />
            <InfoSection title="Location" items={locationInfo} />
          </Col>
          <Col xs={24} md={12}>
            <InfoSection title="Owner Information" items={ownerInfo} />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default BusinessDetailsModal;
