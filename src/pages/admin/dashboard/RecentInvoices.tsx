import React from "react";
import { Card, Table, Typography, Tag, Empty } from "antd";
import { Link } from "react-router-dom";
import { Invoice } from "../../../types";

const { Title } = Typography;

interface RecentInvoicesProps {
  invoices: Invoice[];
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ invoices }) => {
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
      render: (user: any) => user?.name || "Unknown",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";

        switch (status) {
          case "paid":
            color = "success";
            break;
          case "pending":
            color = "warning";
            break;
          case "shipped":
            color = "processing";
            break;
          case "cancelled":
            color = "error";
            break;
          default:
            color = "default";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "right" as const,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Recent Invoices
        </Title>
        {invoices.length > 0 && (
          <Link to="/admin/invoices" style={{ color: "#1890ff" }}>
            View All Invoices →
          </Link>
        )}
      </div>

      {invoices.length > 0 ? (
        <Table
          columns={columns}
          dataSource={invoices.map((invoice) => ({
            ...invoice,
            key: invoice.id,
          }))}
          pagination={false}
          size="middle"
        />
      ) : (
        <Empty description="No invoices found" />
      )}
    </Card>
  );
};

export default RecentInvoices;
