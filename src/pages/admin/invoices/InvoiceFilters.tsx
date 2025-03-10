import React from "react";
import { Input, Select, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface InvoiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={18}>
        <Input
          placeholder="Search by customer name or invoice ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          allowClear
        />
      </Col>
      <Col xs={24} md={6}>
        <Select
          style={{ width: "100%" }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "shipped", label: "Shipped" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </Col>
    </Row>
  );
};

export default InvoiceFilters;
