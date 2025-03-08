import React from "react";
import { Pagination as AntPagination, Typography, Row, Col } from "antd";
import {
  StepBackwardOutlined,
  LeftOutlined,
  RightOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
// Pagination.tsx
interface PaginationProps {
  page: number;
  pageSize: number;
  totalNoOfPages: number;
  totalNoOfData: number;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange?: (current: number, size: number) => void; // Add this prop
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  totalNoOfPages,
  totalNoOfData,
  handlePageChange,
  handlePageSizeChange,
}) => {
  const startItem = totalNoOfData === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalNoOfData);

  const itemRender = (
    current: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    originalElement: React.ReactNode
  ) => {
    if (type === "prev") return <LeftOutlined />;
    if (type === "next") return <RightOutlined />;
    return originalElement;
  };

  const handleFirstPage = () => {
    if (page !== 1) handlePageChange(1);
  };

  const handleLastPage = () => {
    if (page !== totalNoOfPages) handlePageChange(totalNoOfPages);
  };

  return (
    <Row className="mt-6" justify="space-between" align="middle">
      <Col>
        <Text>
          Showing <Text strong>{startItem}</Text> to{" "}
          <Text strong>{endItem}</Text> of <Text strong>{totalNoOfData}</Text>{" "}
          brands
        </Text>
      </Col>
      <Col>
        <Row gutter={8} align="middle">
          <Col>
            <StepBackwardOutlined
              className={`cursor-pointer ${
                page === 1
                  ? "text-gray-300"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={handleFirstPage}
              style={{ opacity: page === 1 ? 0.5 : 1 }}
            />
          </Col>
          <Col>
            <AntPagination
              current={page}
              total={totalNoOfData}
              pageSize={pageSize}
              onChange={handlePageChange}
              onShowSizeChange={handlePageSizeChange} // Add this prop
              itemRender={itemRender}
              showSizeChanger={true} // Enable size changer
              size="small"
            />
          </Col>
          <Col>
            <StepForwardOutlined
              className={`cursor-pointer ${
                page === totalNoOfPages
                  ? "text-gray-300"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={handleLastPage}
              style={{ opacity: page === totalNoOfPages ? 0.5 : 1 }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Pagination;
