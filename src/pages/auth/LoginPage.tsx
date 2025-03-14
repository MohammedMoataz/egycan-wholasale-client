import React from "react";
import { Layout, Typography, Row, Col } from "antd";
import LoginForm from "./LoginForm";

const { Content } = Layout;
const { Title } = Typography;

const LoginPage: React.FC = () => {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px 0" }}>
        <Row justify="center" align="middle">
          <Col xs={22} sm={20} md={16} lg={10} xl={8}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={2}>Welcome Back</Title>
            </div>
            <LoginForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginPage;
