import React from "react";
import { Card, Statistic } from "antd";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  link,
}) => {
  const cardContent = (
    <Card
      hoverable
      style={{ borderRadius: 8 }}
      styles={{ body: { padding: 20 } }}
    >
      <Statistic
        title={title}
        value={value}
        valueStyle={{ color }}
        prefix={React.cloneElement(icon as React.ReactElement, {
          style: { fontSize: 24, color },
        })}
      />
      {link && (
        <div style={{ marginTop: 16 }}>
          <Link to={link} style={{ color: "rgba(0, 0, 0, 0.45)" }}>
            View Details →
          </Link>
        </div>
      )}
    </Card>
  );

  return cardContent;
};

export default StatCard;
