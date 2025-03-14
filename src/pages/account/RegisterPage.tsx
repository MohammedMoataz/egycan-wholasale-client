import React, { useState } from "react";
import { Layout, Typography, Steps, Row, Col, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserOutlined, BankOutlined } from "@ant-design/icons";
import { register as registerUser } from "../../api/auth";
import PersonalInfoForm from "./PersonalInfoForm";
import BusinessInfoForm from "./BusinessInfoForm";
import { PersonalInfo, BusinessInfo } from "../../types";

const { Content } = Layout;
const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalInfo | null>(null);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await registerUser(data);
      return response;
    },
    onSuccess: () => {
      message.success(
        "Registration request submitted! Please wait for admin approval."
      );
      navigate("/login");
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    },
  });

  const handlePersonalSubmit = (data: PersonalInfo) => {
    setPersonalData(data);
    setCurrent(1);
  };

  const handleBusinessSubmit = async (data: BusinessInfo) => {
    if (!personalData) return;

    const formData = new FormData();

    // Personal Info
    formData.append("name", personalData.name);
    formData.append("email", personalData.email);
    formData.append("phone", personalData.phone);
    formData.append("password", personalData.password);

    // Business Info
    formData.append("name", data.name);
    formData.append("legalName", data.legalName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("province", data.province);
    formData.append("postalCode", data.postalCode);

    registerMutation.mutate(formData);
  };

  return (
    <Content style={{ padding: "24px 0", minHeight: "100vh" }}>
      <Row justify="center" align="middle">
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2}>Register</Title>
            <Text>Register as a new user</Text>
          </div>
          <Steps current={current}>
            <Steps.Step title="Personal Info" icon={<UserOutlined />} />
            <Steps.Step title="Business Info" icon={<BankOutlined />} />
          </Steps>
          <div style={{ marginTop: 24, marginBottom: 24 }}>
            {current === 0 && (
              <PersonalInfoForm onNext={handlePersonalSubmit} />
            )}
            {current === 1 && (
              <BusinessInfoForm
                onFinish={handleBusinessSubmit}
                onPrevious={() => setCurrent(0)}
              />
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default RegisterPage;
