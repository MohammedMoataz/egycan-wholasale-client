import React, { useState, useEffect } from "react";
import {
  Modal,
  Descriptions,
  Table,
  Tag,
  Button,
  Select,
  Space,
  Avatar,
  Typography,
  Card,
  Row,
  Col,
  notification,
} from "antd";
import {
  DownloadOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Invoice } from "../../../types";

const { Text, Title } = Typography;

interface InvoiceViewModalProps {
  visible: boolean;
  invoice: Invoice;
  onClose: () => void;
  onStatusChange: (id: number, status: Invoice["status"]) => void;
  onDelete: (invoice: Invoice) => void;
  onDownload: (id: number) => void;
}

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  visible,
  invoice,
  onClose,
  onStatusChange,
  onDelete,
  onDownload,
}) => {
  // Local state to manage status changes in real-time
  const [currentStatus, setCurrentStatus] = useState<Invoice["status"]>(
    invoice.status
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local state when invoice prop changes
  useEffect(() => {
    setCurrentStatus(invoice.status);
  }, [invoice.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "paid":
        return "green";
      case "shipped":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined />;
      case "paid":
        return <CheckCircleOutlined />;
      case "shipped":
        return <CarOutlined />;
      case "cancelled":
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  const getStatusTag = (status: string) => {
    return (
      <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  // Status options with color styling
  const statusOptions = [
    {
      value: "pending",
      label: (
        <span
          style={{ color: "#fa8c16", display: "flex", alignItems: "center" }}
        >
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Pending
        </span>
      ),
    },
    {
      value: "paid",
      label: (
        <span
          style={{ color: "#52c41a", display: "flex", alignItems: "center" }}
        >
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          Paid
        </span>
      ),
    },
    {
      value: "shipped",
      label: (
        <span
          style={{ color: "#1890ff", display: "flex", alignItems: "center" }}
        >
          <CarOutlined style={{ marginRight: 8 }} />
          Shipped
        </span>
      ),
    },
    {
      value: "cancelled",
      label: (
        <span
          style={{ color: "#f5222d", display: "flex", alignItems: "center" }}
        >
          <CloseCircleOutlined style={{ marginRight: 8 }} />
          Cancelled
        </span>
      ),
    },
  ];

  const handleStatusChange = async (value: Invoice["status"]) => {
    setIsUpdating(true);

    try {
      // Update local state immediately for responsive UI
      setCurrentStatus(value);

      // Call the parent handler to update in the backend
      await onStatusChange(invoice.id!, value);

      // Show success notification
      notification.success({
        message: "Status Updated",
        description: `Invoice #${invoice.id} status changed to ${value}`,
        placement: "topRight",
      });
    } catch (error) {
      // If there's an error, revert back to original status
      setCurrentStatus(invoice.status);

      notification.error({
        message: "Update Failed",
        description: "Failed to update invoice status. Please try again.",
        placement: "topRight",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "product",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Total",
      key: "total",
      align: "right" as const,
      render: (record: any) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  // Get background color based on status for status card
  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#fff7e6";
      case "paid":
        return "#f6ffed";
      case "shipped":
        return "#e6f7ff";
      case "cancelled":
        return "#fff1f0";
      default:
        return "white";
    }
  };

  return (
    <Modal
      title={<Title level={4}>{`Invoice #${invoice.id}`}</Title>}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Row gutter={[24, 24]}>
        {/* Customer Information Card */}
        <Col xs={24} md={12}>
          <Card
            title="Customer Information"
            size="small"
            style={{ height: "100%" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Avatar
                size={64}
                icon={<UserOutlined />}
                src={invoice.user?.avatar}
                style={{ marginRight: 16 }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {invoice.user?.name}
                </Title>
                <Space direction="vertical" size={2} style={{ marginTop: 4 }}>
                  <Text type="secondary">
                    <MailOutlined style={{ marginRight: 8 }} />
                    {invoice.user?.email}
                  </Text>
                  {invoice.user?.phone && (
                    <Text type="secondary">
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {invoice.user?.phone}
                    </Text>
                  )}
                </Space>
              </div>
            </div>

            {invoice.user?.businessAddress && (
              <div>
                <Text strong>Shipping Address:</Text>
                <p style={{ marginTop: 4 }}>{invoice.user.businessAddress}</p>
              </div>
            )}
          </Card>
        </Col>

        {/* Invoice Details Card */}
        <Col xs={24} md={12}>
          <Card title="Invoice Details" size="small" style={{ height: "100%" }}>
            <Descriptions column={1} size="small" variant={false}>
              <Descriptions.Item label="Invoice Number">
                <Text strong>{invoice.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(currentStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(invoice.createdAt!).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <Title level={5}>Order Items</Title>
        <Table
          columns={columns}
          dataSource={invoice.items?.map((item) => ({ ...item, key: item.id }))}
          pagination={false}
          variant
          summary={(pageData) => {
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <Title level={5} style={{ margin: 0 }}>
                      Total:
                    </Title>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Title level={5} style={{ margin: 0 }}>
                      ${invoice.totalPrice.toFixed(2)}
                    </Title>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="primary"
          ghost
          icon={<DownloadOutlined />}
          onClick={() => onDownload(invoice.id!)}
        >
          Download PDF
        </Button>

        <Space>
          <Select
            value={currentStatus}
            onChange={handleStatusChange}
            style={{
              width: 140,
              borderColor: getStatusColor(currentStatus),
            }}
            loading={isUpdating}
            options={statusOptions}
            dropdownStyle={{ minWidth: 150 }}
            dropdownMatchSelectWidth={false}
            className={`status-select status-${currentStatus}`}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(invoice)}
          >
            Delete Invoice
          </Button>
        </Space>
      </div>

      {/* CSS for styling the status dropdown */}
      <style jsx>{`
        /* Status-specific select styling */
        .status-select.status-pending .ant-select-selector {
          border-color: #fa8c16 !important;
          background-color: #fff7e6 !important;
        }

        .status-select.status-paid .ant-select-selector {
          border-color: #52c41a !important;
          background-color: #f6ffed !important;
        }

        .status-select.status-shipped .ant-select-selector {
          border-color: #1890ff !important;
          background-color: #e6f7ff !important;
        }

        .status-select.status-cancelled .ant-select-selector {
          border-color: #f5222d !important;
          background-color: #fff1f0 !important;
        }
      `}</style>
    </Modal>
  );
};

export default InvoiceViewModal;
