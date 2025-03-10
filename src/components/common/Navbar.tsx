import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Badge,
  Space,
  Avatar,
  Typography,
  Grid,
  Drawer,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import SearchBar from "./SearchBar";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "account",
      icon: <SettingOutlined />,
      label: <Link to="/account">Account Settings</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <Button
          type="text"
          onClick={handleLogout}
          style={{ width: "100%", textAlign: "left" }}
        >
          Logout
        </Button>
      ),
    },
  ];

  const mobileMenuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "products",
      label: <Link to="/products">Products</Link>,
    },
    ...(isAuthenticated
      ? [
          {
            key: "account",
            label: <Link to="/account">Account Settings</Link>,
          },
          {
            key: "logout",
            label: (
              <Button
                type="text"
                onClick={handleLogout}
                style={{ width: "100%", textAlign: "left" }}
              >
                Logout
              </Button>
            ),
          },
        ]
      : [
          {
            key: "login",
            label: <Link to="/login">Login</Link>,
          },
        ]),
  ];

  // Logo component
  const Logo = () => (
    <Link
      to="/"
      className="logo-container"
      style={{ display: "flex", alignItems: "center" }}
    >
      <svg
        style={{
          width: "32px",
          height: "32px",
          marginRight: "8px",
          color: "#1890ff",
        }}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22 8.5C22 12.09 19.09 15 15.5 15C15.33 15 15.15 14.99 14.98 14.98C14.73 11.81 12.19 9.26 9.02 9.01C9.01 8.85 9 8.67 9 8.5C9 4.91 11.91 2 15.5 2C19.09 2 22 4.91 22 8.5ZM7 15.5C7 19.09 4.09 22 0.5 22C0.33 22 0.15 21.99 0 21.98V13.96C2.78 13.83 5 11.53 5 8.75C5 8.66 4.99 8.58 4.99 8.49C5.17 8.5 5.33 8.5 5.5 8.5C9.09 8.5 12 11.41 12 15C12 15.5 11.96 15.98 11.87 16.45C9.54 16.97 7.74 18.77 7.22 21.1C7.07 19.32 6.11 17.8 4.72 16.84C5.41 16.29 6 15.44 6.32 14.47C6.64 14.81 6.95 15.14 7.29 15.45C7.11 15.44 7.06 15.5 7 15.5Z" />
      </svg>
      <Typography.Title level={4} style={{ margin: 0, color: "#1890ff" }}>
        {screens.md ? "ShopApp" : "SA"}
      </Typography.Title>
    </Link>
  );

  return (
    <Layout.Header
      style={{
        background: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 0",
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        {screens.md && (
          <Menu
            mode="horizontal"
            style={{
              border: "none",
              background: "transparent",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="products">
              <Link to="/products">Products</Link>
            </Menu.Item>
            <Menu.Item key="search">
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </Menu.Item>

            {/* Auth Links */}
            {isAuthenticated ? (
              <Menu.Item key="user">
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    style={{ height: "100%", padding: "0 8px" }}
                  >
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} />
                      {screens.lg && (
                        <Text
                          style={{
                            maxWidth: screens.xl ? "150px" : "100px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user?.name}
                        </Text>
                      )}
                    </Space>
                  </Button>
                </Dropdown>
              </Menu.Item>
            ) : (
              <Menu.Item key="login">
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}

            {/* Cart */}
            <Menu.Item key="cart">
              <Link
                to="/cart"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Badge count={totalItems} showZero={false}>
                  <ShoppingCartOutlined style={{ fontSize: "18px" }} />
                </Badge>
                {screens.lg && <Text style={{ marginLeft: "8px" }}>Cart</Text>}
              </Link>
            </Menu.Item>
          </Menu>
        )}

        {/* Mobile Navigation */}
        {!screens.md && (
          <Space size="middle">
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />

            <Link to="/cart">
              <Badge count={totalItems} showZero={false}>
                <ShoppingCartOutlined style={{ fontSize: "20px" }} />
              </Badge>
            </Link>

            <Button
              type="text"
              icon={isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </Space>
        )}
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div
          style={{
            padding: "12px 24px",
            background: "#fff",
            borderTop: "1px solid #f0f0f0",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        closable={true}
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        width={screens.sm ? 300 : 250}
      >
        <Menu
          mode="vertical"
          style={{ border: "none" }}
          items={mobileMenuItems}
          onClick={() => setIsMenuOpen(false)}
        />
      </Drawer>
    </Layout.Header>
  );
};

export default Navbar;
