import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Category } from "../../types";

const { Title } = Typography;
const { Meta } = Card;

// Default placeholder image for categories
const defaultCategoryImage =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section
      className="mb-12"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={2} style={{ color: "#1d4ed8", margin: 0 }}>
          Shop by Category
        </Title>
        <Link to="/products">
          <Button
            type="link"
            style={{
              color: "#1d4ed8",
              padding: 0,
              height: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            View All{" "}
            <RightOutlined
              style={{ fontSize: "0.875rem", marginLeft: "4px" }}
            />
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        {categories.slice(0, 8).map((category) => (
          <Col xs={12} md={8} lg={6} key={category.id}>
            <Link to={`/category/${category.id}`}>
              <Card
                hoverable
                cover={
                  <div style={{ height: "160px", overflow: "hidden" }}>
                    <img
                      alt={category.name}
                      src={`https://source.unsplash.com/random/300x200/?${category.name.toLowerCase()}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src =
                          defaultCategoryImage;
                      }}
                    />
                  </div>
                }
                style={{ background: "#FAFAFA" }}
              >
                <Meta
                  title={
                    <span style={{ color: "#1e40af", fontWeight: 600 }}>
                      {category.name}
                    </span>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default CategorySection;
