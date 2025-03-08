import React from "react";
import { Brand } from "../../../types";
import { Table, Space, Button, Avatar, Tooltip, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Text, Paragraph } = Typography;

interface BrandTableProps {
  brands: Brand[];
  openEditModal: (brand: Brand) => void;
  openDeleteModal: (brand: Brand) => void;
  loading?: boolean;
}

const BrandTable: React.FC<BrandTableProps> = ({
  brands,
  openEditModal,
  openDeleteModal,
  loading = false,
}) => {
  const columns: ColumnsType<Brand> = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      width: 90,
      render: (imageUrl: string, record: Brand) => (
        <Avatar
          size={48}
          src={imageUrl}
          shape="square"
          icon={!imageUrl && <FileImageOutlined />}
          alt={record.name}
        />
      ),
    },
    {
      title: "Brand Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "35%",
      render: (description: string) => (
        <Paragraph ellipsis={{ rows: 2 }} title={description}>
          {description || <Text type="secondary">No description</Text>}
        </Paragraph>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime(),
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return <Text type="secondary">{formattedDate}</Text>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_: any, record: Brand) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={brands}
      rowKey="id"
      loading={loading}
      pagination={false} // Disable internal pagination
      bordered={false}
      className="shadow-md rounded-lg overflow-hidden"
      scroll={{ x: 800 }}
      locale={{ emptyText: "No brands found" }}
    />
  );
};

export default BrandTable;
