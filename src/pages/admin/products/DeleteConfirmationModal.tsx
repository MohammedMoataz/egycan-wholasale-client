// src/pages/components/DeleteConfirmationModal.tsx
import React from "react";
import { Modal, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../../api/products";
import { Product } from "../../../types";
import { message } from "antd";

const { Text } = Typography;

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Product deleted successfully");
      onClose();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to delete product"
      );
    },
  });

  const handleDelete = () => {
    if (product?.id) {
      deleteProductMutation.mutate(product.id);
    }
  };

  return (
    <Modal
      title="Confirm Delete"
      open={isOpen}
      onCancel={onClose}
      onOk={handleDelete}
      okText="Delete"
      okButtonProps={{
        danger: true,
        loading: deleteProductMutation.isPending,
      }}
      cancelButtonProps={{ disabled: deleteProductMutation.isPending }}
    >
      <p>
        Are you sure you want to delete <Text strong>{product?.name}</Text>?
        This action cannot be undone.
      </p>
    </Modal>
  );
};

export default DeleteConfirmationModal;
