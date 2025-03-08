import React from "react";
import { Modal, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { deleteCategory, deleteSubcategory } from "../../../api/categories";
import { EnhancedCategory, EnhancedSubcategory } from "./AdminCategoriesPage";

const { Text } = Typography;

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "category" | "subcategory";
  itemToDelete: EnhancedCategory | EnhancedSubcategory | null;
  onSuccess: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  type,
  itemToDelete,
  onSuccess,
}) => {
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess,
    onError: (error: any) => {
      console.error("Failed to delete category:", error);
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: (id: number) => deleteSubcategory(id),
    onSuccess,
    onError: (error: any) => {
      console.error("Failed to delete subcategory:", error);
    },
  });

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (type === "category") {
      deleteCategoryMutation.mutate(itemToDelete.id);
    } else {
      deleteSubcategoryMutation.mutate(itemToDelete.id);
    }
  };

  const title = `Delete ${type === "category" ? "Category" : "Subcategory"}`;
  const itemName = itemToDelete?.name || "";

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleDelete}
      onCancel={onClose}
      okText="Delete"
      okButtonProps={{
        danger: true,
        loading:
          deleteCategoryMutation.isPending ||
          deleteSubcategoryMutation.isPending,
      }}
    >
      <p>
        Are you sure you want to delete <Text strong>{itemName}</Text>?
        {type === "category" && (
          <Text type="danger">
            {" "}
            This will also delete all subcategories in this category.
          </Text>
        )}
      </p>
    </Modal>
  );
};

export default DeleteConfirmModal;
