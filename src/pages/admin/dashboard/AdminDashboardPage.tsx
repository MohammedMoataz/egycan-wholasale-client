import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, Row, Col, Typography, Table, Tag, Space, Statistic } from "antd";
import {
  ShoppingOutlined,
  TagOutlined,
  BookOutlined,
  FileTextOutlined,
  RiseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getProducts } from "../../../api/products";
import { getCategories } from "../../../api/categories";
import { getBrands } from "../../../api/brands";
import { getInvoices } from "../../../api/invoices";
import RecentInvoices from "./RecentInvoices";
import StatCard from "./StatCard";

const { Title } = Typography;

const AdminDashboardPage: React.FC = () => {
  const { data: productsResponse } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 10,
      }),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(1, 10),
  });

  const { data: brandsResponse } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(1, 10),
  });

  const { data: invoicesResponse } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(1, 10),
  });

  const products = productsResponse?.data;
  const categories = categoriesResponse?.data;
  const brands = brandsResponse?.data;
  const invoices = invoicesResponse?.data;

  // Calculate total sales
  const totalSales =
    invoices?.reduce((sum, invoice) => sum + invoice.totalPrice, 0) || 0;

  // Get unique customers count
  const uniqueCustomers =
    invoices?.reduce((acc, curr) => {
      if (!acc.includes(curr.userId)) {
        acc.push(curr.userId);
      }
      return acc;
    }, [] as number[]).length || 0;

  // Get recent invoices
  const recentInvoices = invoices?.slice(0, 5) || [];

  const statCards = [
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      icon: <RiseOutlined />,
      color: "#52c41a",
    },
    {
      title: "Products",
      value: products?.length || 0,
      icon: <ShoppingOutlined />,
      color: "#1890ff",
      link: "/admin/products",
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      icon: <TagOutlined />,
      color: "#722ed1",
      link: "/admin/categories",
    },
    {
      title: "Brands",
      value: brands?.length || 0,
      icon: <BookOutlined />,
      color: "#faad14",
      link: "/admin/brands",
    },
    {
      title: "Invoices",
      value: invoices?.length || 0,
      icon: <FileTextOutlined />,
      color: "#f5222d",
      link: "/admin/invoices",
    },
    {
      title: "Customers",
      value: uniqueCustomers,
      icon: <UserOutlined />,
      color: "#722ed1",
    },
  ];

  return (
    <div className="dashboard-container">
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              link={card.link}
            />
          </Col>
        ))}
      </Row>

      {/* Recent Invoices */}
      <RecentInvoices invoices={recentInvoices} />
    </div>
  );
};

export default AdminDashboardPage;
