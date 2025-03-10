import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Typography, Space, Divider, Grid } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const AppFooter: React.FC = () => {
  const screens = useBreakpoint();

  return (
    <Footer
      style={{
        backgroundColor: "#001529",
        padding: screens.sm ? "48px 24px 24px" : "32px 16px 16px",
        color: "rgba(255, 255, 255, 0.65)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row
          gutter={[
            { xs: 16, sm: 24, md: 32 },
            { xs: 24, sm: 32 },
          ]}
        >
          {/* Company Info */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <Title
              level={4}
              style={{
                color: "#fff",
                marginBottom: screens.md ? "16px" : "12px",
              }}
            >
              ShopApp
            </Title>
            <Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.65)",
                marginBottom: "16px",
              }}
            >
              Your one-stop shop for all your shopping needs. Quality products
              at affordable prices.
            </Paragraph>
            <Space size={screens.sm ? "middle" : "small"}>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                  fontSize: screens.sm ? "20px" : "18px",
                }}
              >
                <FacebookOutlined />
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                  fontSize: screens.sm ? "20px" : "18px",
                }}
              >
                <TwitterOutlined />
              </a>
              <a
                href="#"
                style={{
                  color: "rgba(255, 255, 255, 0.65)",
                  fontSize: screens.sm ? "20px" : "18px",
                }}
              >
                <InstagramOutlined />
              </a>
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6} lg={6}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: screens.md ? "16px" : "12px",
              }}
            >
              Quick Links
            </Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: screens.sm ? "8px" : "6px" }}>
                <Link to="/" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: screens.sm ? "8px" : "6px" }}>
                <Link
                  to="/products"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  Products
                </Link>
              </li>
              <li style={{ marginBottom: screens.sm ? "8px" : "6px" }}>
                <Link to="/cart" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Cart
                </Link>
              </li>
            </ul>
          </Col>

          {/* Categories */}
          <Col xs={24} sm={12} md={6} lg={6}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: screens.md ? "16px" : "12px",
              }}
            >
              Categories
            </Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: screens.sm ? "8px" : "6px" }}>
                <Link
                  to="/products?category=1"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  Electronics
                </Link>
              </li>
              <li style={{ marginBottom: screens.sm ? "8px" : "6px" }}>
                <Link
                  to="/products?category=2"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  Clothing
                </Link>
              </li>
              <li style={{ marginBottom: screens.sm ? "8px" : "6px" }}>
                <Link
                  to="/products?category=3"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  Home & Kitchen
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <Title
              level={5}
              style={{
                color: "#fff",
                marginBottom: screens.md ? "16px" : "12px",
              }}
            >
              Contact Us
            </Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li
                style={{
                  marginBottom: screens.sm ? "12px" : "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MailOutlined style={{ marginRight: "8px" }} />
                <span>support@shopapp.com</span>
              </li>
              <li
                style={{
                  marginBottom: screens.sm ? "12px" : "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PhoneOutlined style={{ marginRight: "8px" }} />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </Col>
        </Row>

        <Divider
          style={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            margin: screens.sm ? "24px 0" : "16px 0",
          }}
        />

        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <Text style={{ color: "rgba(255, 255, 255, 0.45)" }}>
              &copy; {new Date().getFullYear()} ShopApp. All rights reserved.
            </Text>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
