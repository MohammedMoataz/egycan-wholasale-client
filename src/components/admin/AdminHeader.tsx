import React, { useState } from "react";
import { Layout, Avatar, Typography, Button, Grid, Drawer, Menu } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingOutlined,
  TagOutlined,
  BookOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  LogoutOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { logout } from "../../api/auth";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AdminHeader: React.FC = () => {
  const { user } = useAuthStore();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

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

  return (
    <>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{ marginRight: 16 }}
            onClick={toggleDrawer}
          />
        )}

        <div style={{ flex: 1 }}></div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {screens.sm && (
            <div
              style={{
                marginRight: 20,
                textAlign: "right",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: 16,
                  lineHeight: "1.2",
                  marginBottom: 0,
                }}
              >
                {user?.name}
              </Text>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  lineHeight: "1.2",
                  marginTop: 0,
                }}
              >
                {(user?.role === "admin" && "Admin") || "Manager"}
              </Text>
            </div>
          )}
          <Avatar
            style={{
              backgroundColor: "#5B5FC7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<UserOutlined />}
            size={40}
          />
        </div>
      </Header>

      <Drawer
        title="Menu"
        placement="left"
        onClose={toggleDrawer}
        onClick={toggleDrawer}
        open={drawerVisible}
      >
        <Menu mode="vertical" items={menuItems} />
      </Drawer>
    </>
  );
};

export default AdminHeader;
