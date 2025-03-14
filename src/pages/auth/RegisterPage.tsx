import React, { useState } from "react";
import { Layout, Typography, Steps, Row, Col, message } from "antd";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserOutlined, BankOutlined } from "@ant-design/icons";
import { signUp } from "../../api/auth";
import PersonalInfoForm from "./PersonalInfoForm";
import BusinessInfoForm from "../account/BusinessInfoForm";
import { PersonalInfo, BusinessInfo } from "../../types";
import { createBusiness } from "../../api/businesses";

const { Content } = Layout;
const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalInfo | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);

  const userInfoSubmitMutation = useMutation({
    mutationFn: async (data: PersonalInfo) => {
      const response = await signUp(data);
      console.log("PersonalResponse", response);
      setOwnerId(response.data.userDetails.id);
      return response;
    },
    onSuccess: () => {
      message.success("Let's submit your business data");
      setCurrent(1);
    },@
    onError: () => {
      message.error("Registration failed. Please try again.");
    },
  });

  const businessInfoSubmitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log(data);
      const response = await createBusiness(data);
      console.log("businessResponse: ", response);
      return response;
    },
    onSuccess: () => {
      message.success(
        "Registration request submitted! Please wait for admin approval."
      );
    },
    onError: () => {
      message.error("Registration failed. Please try again.");
    },
  });

  const handlePersonalSubmit = (data: PersonalInfo) => {
    setPersonalData(data);
    userInfoSubmitMutation.mutate(data);
  };

  const handleBusinessSubmit = async (data: BusinessInfo) => {
    if (!personalData) return;

    const formData = new FormData();

    // Personal Info
    formData.append("ownerId", ownerId!.toString());
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

    businessInfoSubmitMutation.mutate(formData);
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
