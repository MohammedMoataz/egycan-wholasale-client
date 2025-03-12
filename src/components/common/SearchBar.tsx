import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  List,
  Spin,
  Empty,
  Avatar,
  Typography,
  Space,
  Grid,
} from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { searchProducts } from "../../api/products";
import { Product } from "../../types";

interface SearchBarProps {
  onClose: () => void;
}

const { Text } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const data = await searchProducts(query);
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching products:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleProductClick = (productId: number) => {
    navigate(`/products?id=${productId}`);
    setShowResults(false);
    onClose();
  };

  const handleSubmit = (value: string) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
      setShowResults(false);
      onClose();
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} style={{ width: "100%", position: "relative" }}>
      <Search
        placeholder="Search products..."
        allowClear
        enterButton={screens.sm}
        size={screens.sm ? "large" : "middle"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSubmit}
        prefix={<SearchOutlined />}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />

      {showResults && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            marginTop: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "4px",
            zIndex: 1000,
            maxHeight: screens.sm ? "400px" : "300px",
            overflowY: "auto",
          }}
        >
          {isLoading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Spin />
            </div>
          ) : results.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={results}
              renderItem={(product) => (
                <List.Item
                  onClick={() => handleProductClick(product.id!)}
                  style={{
                    cursor: "pointer",
                    padding: screens.sm ? "12px 16px" : "8px 12px",
                  }}
                  className="search-item-hover"
                >
                  <List.Item.Meta
                    avatar={
                      product.images && product.images[0] ? (
                        <Avatar
                          size={screens.sm ? 48 : 40}
                          shape="square"
                          src={product.images[0].imageUrl}
                        />
                      ) : (
                        <Avatar
                          size={screens.sm ? 48 : 40}
                          shape="square"
                          icon={<SearchOutlined />}
                        />
                      )
                    }
                    title={product.name}
                    description={
                      <Text type="secondary">${product.price.toFixed(2)}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : query.length >= 2 ? (
            <Empty
              description="No products found"
              style={{ padding: screens.sm ? "20px" : "16px" }}
              styles={{ image: { height: screens.sm ? 60 : 40 } }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
