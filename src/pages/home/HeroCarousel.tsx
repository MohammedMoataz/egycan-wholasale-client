import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Typography, Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// Hero Carousel Data
const heroCarouselItems = [
  {
    title: "Shop the Latest Products",
    description:
      "Discover amazing products at unbeatable prices. Shop now and enjoy fast shipping!",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    backgroundColor: "#0F766E", // teal-700
  },
  {
    title: "Summer Sale Extravaganza",
    description: "Massive discounts on top brands. Limited time offer!",
    image:
      "https://images.unsplash.com/photo-1553531889-56cc480ac5cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundColor: "#047857", // emerald-700
  },
  {
    title: "New Season, New Styles",
    description: "Explore our latest collection and refresh your wardrobe!",
    image:
      "https://images.unsplash.com/photo-1713646778050-2213b4140e6b?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundColor: "#0E7490", // cyan-700
  },
];

const HeroCarousel = () => {
  return (
    <section className="mb-12">
      <Carousel
        autoplay
        effect="fade"
        dots={{ className: "custom-dots" }}
      >
        {heroCarouselItems.map((item, index) => (
          <div key={index}>
            <div
              style={{
                height: "600px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background Image with Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Dark Overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                  }}
                ></div>
              </div>

              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  maxWidth: "1200px",
                  margin: "0 auto",
                  padding: "0 24px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ maxWidth: "600px", color: "#fff" }}>
                  <Title
                    level={1}
                    style={{
                      color: "#fff",
                      fontSize: "2.5rem",
                      marginBottom: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </Title>
                  <Paragraph
                    style={{
                      color: "rgba(255, 255, 255, 0.85)",
                      fontSize: "1.125rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {item.description}
                  </Paragraph>
                  <Link to="/products">
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        background: "#fff",
                        color: "#1890ff",
                        border: "none",
                        height: "auto",
                        padding: "12px 24px",
                      }}
                    >
                      Shop Now <RightOutlined />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
