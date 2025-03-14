import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ShoppingOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import {
  Typography,
  Button,
  Table,
  Card,
  Space,
  Image,
  InputNumber,
  Divider,
  Empty,
} from "antd";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { createInvoice } from "../../api/invoices";

const { Title, Text } = Typography;

// Default image when product image is not available
const DEFAULT_IMAGE =
  "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg";

// CartItem component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center py-4">
      <Image
        src={
          (item.product.images && item.product.images[0]?.imageUrl) ||
          DEFAULT_IMAGE
        }
        alt={item.product.name}
        width={80}
        height={80}
        className="object-cover rounded"
        fallback={DEFAULT_IMAGE}
      />
      <div className="ml-4 flex-1">
        <Text strong>{item.product.name}</Text>
        <div>
          <Text type="secondary">{item.product.brand?.name}</Text>
        </div>
      </div>
      <div className="flex items-center mx-4">
        <Button
          icon={<MinusOutlined />}
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          size="small"
        />
        <InputNumber
          min={1}
          max={item.product.inStock}
          value={item.quantity}
          onChange={(value) => onUpdateQuantity(item.product.id, value)}
          className="mx-2"
          size="small"
          controls={false}
          style={{ width: "50px" }}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          disabled={item.quantity >= item.product.inStock}
          size="small"
        />
      </div>
      <div className="mx-4 text-right" style={{ minWidth: "80px" }}>
        <Text>${item.product.price.toFixed(2)}</Text>
      </div>
      <div className="mx-4 text-right" style={{ minWidth: "80px" }}>
        <Text strong>${(item.product.price * item.quantity).toFixed(2)}</Text>
      </div>
      <Button
        icon={<DeleteOutlined />}
        onClick={() => onRemove(item.product.id)}
        danger
        type="text"
      />
    </div>
  );
};

// CartItemList component
const CartItemList = ({ items, onUpdateQuantity, onRemove }) => {
  return (
    <Card bordered={false} className="mb-4">
      <div className="mb-4 flex justify-between border-b pb-2">
        <Text strong>Product</Text>
        <Text strong className="ml-auto pr-32">
          Quantity
        </Text>
        <Text strong style={{ minWidth: "80px" }} className="text-right">
          Price
        </Text>
        <Text strong style={{ minWidth: "80px" }} className="text-right">
          Total
        </Text>
        <div style={{ width: "32px" }}></div>
      </div>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <CartItem
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
          <Divider className="my-2" />
        </React.Fragment>
      ))}
    </Card>
  );
};

// OrderSummary component
const OrderSummary = ({ totalPrice, onCheckout, isProcessing }) => {
  return (
    <Card bordered={false}>
      <Title level={4}>Order Summary</Title>
      <Divider />
      <div className="flex justify-between mb-2">
        <Text>Subtotal</Text>
        <Text>${totalPrice.toFixed(2)}</Text>
      </div>
      <div className="flex justify-between mb-2">
        <Text>Shipping</Text>
        <Text>Free</Text>
      </div>
      <Divider />
      <div className="flex justify-between">
        <Title level={5}>Total</Title>
        <Title level={5}>${totalPrice.toFixed(2)}</Title>
      </div>
      <Button
        type="primary"
        block
        onClick={onCheckout}
        loading={isProcessing}
        className="mt-4"
        size="large"
      >
        {isProcessing ? "Processing..." : "Checkout"}
      </Button>
      <Button type="link" block href="/products" className="mt-2">
        Continue Shopping
      </Button>
    </Card>
  );
};

// EmptyCart component
const EmptyCart = () => {
  return (
    <Empty
      image={<ShoppingOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
      description={
        <Space direction="vertical" align="center">
          <Title level={4}>Your cart is empty</Title>
          <Text type="secondary">
            Looks like you haven't added any products to your cart yet.
          </Text>
          <Button type="primary" href="/products">
            Continue Shopping
          </Button>
        </Space>
      }
      className="py-12"
    />
  );
};

// Main CartPage component
const CartPage = () => {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const createInvoiceMutation = useMutation({
    mutationFn: () => {
      const cartItems = items
        .filter((item) => item.product.id !== undefined)
        .map((item) => ({
          productId: item.product.id!,
          quantity: item.quantity,
        }));
      return createInvoice(cartItems);
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    },
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    createInvoiceMutation.mutate();
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="mb-6">
        Shopping Cart
      </Title>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemList
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            totalPrice={totalPrice}
            onCheckout={handleCheckout}
            isProcessing={createInvoiceMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
