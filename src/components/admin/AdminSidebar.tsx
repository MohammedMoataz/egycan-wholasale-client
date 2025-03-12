import React from "react";
import { Layout, Menu, Typography, Grid } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingOutlined,
  TagOutlined,
  BookOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";

const { Sider } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const screens = useBreakpoint();

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/agents",
      icon: <UsergroupAddOutlined />,
      label: <Link to="/admin/agents">Agents</Link>,
    },
    {
      key: "/admin/customers",
      icon: <ShopOutlined />,
      label: <Link to="/admin/customers">Customers</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Products</Link>,
    },
    {
      key: "/admin/categories",
      icon: <TagOutlined />,
      label: <Link to="/admin/categories">Categories</Link>,
    },
    {
      key: "/admin/brands",
      icon: <BookOutlined />,
      label: <Link to="/admin/brands">Brands</Link>,
    },
    {
      key: "/admin/invoices",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/invoices">Invoices</Link>,
    },
    {
      key: "/admin/account",
      icon: <UserOutlined />,
      label: <Link to="/admin/account">Account</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => logout(),
    },
  ];

  // Only render the sidebar if we're on md screens or larger
  if (!screens.md) {
    return null;
  }

  return (
    <Sider width={256} style={{ background: "#1d4ed8" }}>
      <div style={{ padding: 24 }}>
        <Link to="/admin">
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Admin Panel
          </Title>
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          background: "#1d4ed8",
          color: "white",
          borderRight: 0,
        }}
        items={menuItems}
        theme="dark"
      />
    </Sider>
  );
};

export default AdminSidebar;
