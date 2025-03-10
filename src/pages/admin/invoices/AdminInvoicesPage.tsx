import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Typography,
  Input,
  Select,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Descriptions,
  Spin,
  message,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  getInvoices,
  updateInvoiceStatus,
  deleteInvoice,
  downloadInvoicePdf,
} from "../../../api/invoices";
import { Invoice } from "../../../types";
import InvoiceViewModal from "./InvoiceViewModal.tsx";
import InvoiceFilters from "./InvoiceFilters";

const { Title } = Typography;
const { confirm } = Modal;

const AdminInvoicesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Fetch invoices
  const { data: invoicesResponse, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(1, 10),
  });
  const invoices = invoicesResponse?.data;
  const meta = invoicesResponse?.meta;

  // Update invoice status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Invoice["status"] }) =>
      updateInvoiceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      message.success("Invoice status updated successfully");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update invoice status"
      );
    },
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      message.success("Invoice deleted successfully");
      setCurrentInvoice(null);
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to delete invoice"
      );
    },
  });

  const handleDownloadPdf = async (id: number) => {
    try {
      await downloadInvoicePdf(id);
      message.success("Invoice downloaded successfully");
    } catch (error) {
      message.error("Failed to download invoice");
    }
  };

  const openViewModal = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = (id: number, status: Invoice["status"]) => {
    updateStatusMutation.mutate({ id, status });
  };

  const showDeleteConfirm = (invoice: Invoice) => {
    confirm({
      title: `Are you sure you want to delete Invoice #${invoice.id}?`,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteInvoiceMutation.mutate(invoice.id!);
      },
    });
  };

  // Filter invoices
  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch =
      invoice.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: number) => `#${id}`,
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (user: any) => (
        <div>
          <div>{user?.name}</div>
          <div style={{ color: "rgba(0, 0, 0, 0.45)", fontSize: 12 }}>
            {user?.email}
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Invoice) => (
        <Select
          value={status}
          onChange={(value) =>
            handleStatusChange(record.id!, value as Invoice["status"])
          }
          style={{
            width: 130,
            // Set dropdown border color based on status
            borderColor: getStatusColor(status),
          }}
          options={statusOptions}
          dropdownStyle={{ minWidth: 150 }}
          // Apply colored styling to the select component
          dropdownMatchSelectWidth={false}
          variant
          className={`status-select status-${status}`}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Invoice) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record)}
            title="View Invoice"
          />
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadPdf(record.id)}
            title="Download PDF"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            title="Delete Invoice"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-invoices-container">
      <Title level={2} style={{ marginBottom: 24 }}>
        Invoices
      </Title>

      {/* Filters */}
      <InvoiceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Invoices Table */}
      <div
        style={{ marginTop: 16, overflowX: "scroll", backgroundColor: "#fff" }}
      >
        {isLoading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 40 }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredInvoices?.map((invoice) => ({
              ...invoice,
              key: invoice.id,
            }))}
            pagination={{ pageSize: 10 }}
            variant
            locale={{ emptyText: "No invoices found" }}
          />
        )}
      </div>

      {/* View Invoice Modal */}
      {currentInvoice && (
        <InvoiceViewModal
          visible={isViewModalOpen}
          invoice={currentInvoice}
          onClose={() => setIsViewModalOpen(false)}
          onStatusChange={handleStatusChange}
          onDelete={showDeleteConfirm}
          onDownload={handleDownloadPdf}
        />
      )}

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
    </div>
  );
};

export default AdminInvoicesPage;
