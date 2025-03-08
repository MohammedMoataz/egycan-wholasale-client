import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Layout,
  Typography,
  Button,
  Input,
  Space,
  Spin,
  Empty,
  Card,
  Row,
  Col,
  Pagination,
} from "antd";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../api/brands";
import { Brand, Meta } from "../../types";
import BrandTable from "./brand/BrandTable";
import DeleteModal from "./brand/DeleteModal";
// import Pagination from "./brand/Pagination";
import BrandModal from "./brand/BrandModal";

const { Title } = Typography;
const { Content } = Layout;

const AdminBrandsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brandData, setBrandData] = useState<FormData>(new FormData());
  const [imagePreview, setImagePreview] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch brands
  const { data, isLoading } = useQuery({
    queryKey: ["brands", page, pageSize],
    queryFn: () => getBrands(page, pageSize),
  });

  // const { data, isLoading } = useQuery({
  //   queryKey: ["brands", page, pageSize, searchTerm],
  //   queryFn: () => getBrands(page, pageSize, searchTerm), // Update API call to include searchTerm
  // });

  const brands: Brand[] = data?.data || [];
  const meta: Meta = data?.meta || { totalNoOfPages: 1, totalNoOfData: 0 };

  // Handlers
  const openCreateModal = () => {
    setCurrentBrand(null);
    setBrandData(new FormData());
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setCurrentBrand(brand);
    const formData = new FormData();
    formData.set("name", brand.name);
    formData.set("description", brand.description || "");
    setBrandData(formData);
    setImagePreview(brand.imageUrl);
    setIsModalOpen(true);
  };

  const openDeleteModal = (brand: Brand) => {
    setCurrentBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= meta.totalNoOfPages) {
      setPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (current: number, size: number) => {
    setPage(1); // Reset to the first page when page size changes
    setPageSize(size);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBrandData((prev) => {
      const newFormData = new FormData(prev);
      newFormData.set(name, value);
      return newFormData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrandData((prev) => {
        const newFormData = new FormData(prev);
        newFormData.set("imageFile", file);
        return newFormData;
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandData.get("name")?.toString().trim()) return;

    if (currentBrand) {
      updateBrandMutation.mutate({ id: currentBrand.id, data: brandData });
    } else {
      createBrandMutation.mutate(brandData);
    }
  };

  const resetForm = () => {
    setBrandData(new FormData());
    setImagePreview("");
    setCurrentBrand(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Mutations
  const createBrandMutation = useMutation({
    mutationFn: async (brandData: FormData) => await createBrand(brandData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand created successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create brand");
    },
  });

  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand updated successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update brand");
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand deleted successfully");
      setIsDeleteModalOpen(false);
      setCurrentBrand(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete brand");
    },
  });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout className="h-full bg-white">
      <Content className="p-6">
        {/* Header */}
        <Row justify="space-between" align="middle" className="mb-6">
          <Col>
            <Title level={3}>Brands</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Add Brand
            </Button>
          </Col>
        </Row>

        {/* Search */}
        <Card className="mb-6">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>

        {/* Brands Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Loading brands..." />
          </div>
        ) : (
          <>
            {filteredBrands.length === 0 ? (
              <Card className="mb-6">
                <Empty
                  description="No brands found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            ) : (
              <>
                <BrandTable
                  brands={filteredBrands}
                  openEditModal={openEditModal}
                  openDeleteModal={openDeleteModal}
                  loading={isLoading}
                />
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={meta.totalNoOfData}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageSizeChange}
                />
              </>
            )}
          </>
        )}

        {/* Modals */}
        <BrandModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={brandData}
          setFormData={setBrandData}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          currentBrand={currentBrand}
          fileInputRef={fileInputRef}
          createBrandMutation={createBrandMutation}
          updateBrandMutation={updateBrandMutation}
        />

        <DeleteModal
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          currentBrand={currentBrand}
          deleteBrandMutation={deleteBrandMutation}
        />
      </Content>
    </Layout>
  );
};

export default AdminBrandsPage;
