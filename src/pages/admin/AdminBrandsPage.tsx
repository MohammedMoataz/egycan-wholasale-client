import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  Award,
  X,
  Save,
  RefreshCw,
  Sparkles,
  ChevronLast,
  ChevronFirst,
  Image,
  Upload,
} from "lucide-react";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../api/brands";
import { Brand, MetaData } from "../../types";

// Form data interface
interface BrandFormData {
  name: string;
  description: string;
  imageFile: File | null;
}

const AdminBrandsPage: React.FC = () => {
  const queryClient = useQueryClient();
  // const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brandData, setBrandData] = useState<BrandFormData>({
    name: "",
    description: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [brandName, setBrandName] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch brands
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(page, pageSize),
  });

  const brands: Brand[] = data?.data || [];
  const meta: MetaData = data?.meta || {};

  const openCreateModal = () => {
    setCurrentBrand(null);
    setBrandName("");
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setCurrentBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      imageFile: null,
      currentImageUrl: brand.imageUrl,
    });
    setImagePreview(brand.imageUrl);
    setIsModalOpen(true);
  };

  const openDeleteModal = (brand: Brand) => {
    setCurrentBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const filteredBrands = brands
  // .filter((brand) =>
  //   brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Modified API functions to use FormData with file upload
  const createBrandWithFormData = async (brandData: BrandFormData) => {
    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("description", brandData.description);

    if (brandData.imageFile) {
      formData.append("image", brandData.imageFile);
    }

    return createBrand(formData);
  };

  const updateBrandWithFormData = async (
    id: number,
    brandData: BrandFormData
  ) => {
    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("description", brandData.description);

    if (brandData.imageFile) {
      formData.append("image", brandData.imageFile);
    }

    return updateBrand(id, formData);
  };

  const [formData, setFormData] = useState<BrandFormData>({
    name: "",
    description: "",
    imageFile: null,
  });

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= meta.totalNoOfPages) {
      setPage(newPage);
    }
  };

  // Handle Input changes for name and description
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: (brandData: BrandFormData) =>
      createBrandWithFormData(brandData),
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

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BrandFormData }) =>
      updateBrandWithFormData(id, data),
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

  // Delete brand mutation
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageFile: null,
    });
    setImagePreview("");
    setCurrentBrand(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (currentBrand) {
      updateBrandMutation.mutate({
        id: currentBrand.id,
        data: formData,
      });
    } else {
      createBrandMutation.mutate(formData);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-10xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Award className="text-indigo-600" size={28} />
            <h1 className="text-3xl font-bold text-gray-800">
              Brands Management
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Add Brand
          </button>
        </div>

        {/* Search bar */}
        {/* <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-full">
              <input
                type="text"
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div> */}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <RefreshCw className="animate-spin h-12 w-12 text-indigo-500 mb-3" />
              <p className="text-gray-500">Loading brands...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {filteredBrands.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-indigo-500" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No brands found
                </h3>
                <p className="text-gray-500 mb-4">
                  {/* {searchTerm
                    ? "Try adjusting your search terms" */}
                  Start by adding your first brand
                </p>
                {/* {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <X size={16} className="mr-1" />
                    Clear search
                  </button>
                ) : ( */}
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <Plus size={16} className="mr-1" />
                  Add your first brand
                </button>
                {/* )} */}
              </div>
            )}

            {/* List Brands */}
            {brands.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Brand Name
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {brands.map((brand: Brand) => (
                        <tr
                          key={brand.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                              {brand.imageUrl ? (
                                <img
                                  src={brand.imageUrl}
                                  alt={brand.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Image className="text-gray-400" size={16} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {brand.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                              {brand.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(brand.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal(brand)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3 p-1.5 hover:bg-indigo-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(brand)}
                              className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {brands.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(page - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(page * pageSize, meta.totalNoOfBrands)}
                  </span>{" "}
                  of <span className="font-medium">{meta.totalNoOfBrands}</span>{" "}
                  brands
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className="p-2 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronFirst size={16} />
                  </button>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, meta.totalNoOfPages) },
                      (_, i) => {
                        // Show first page, last page, current page, and pages around current
                        let pageToShow;
                        if (meta.totalNoOfPages <= 5) {
                          pageToShow = i + 1;
                        } else if (page <= 3) {
                          pageToShow = i + 1;
                        } else if (page >= meta.totalNoOfPages - 2) {
                          pageToShow = meta.totalNoOfPages - 4 + i;
                        } else {
                          pageToShow = page - 2 + i;
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(pageToShow)}
                            className={`w-8 h-8 flex items-center justify-center rounded ${
                              page === pageToShow
                                ? "bg-indigo-600 text-white"
                                : "border text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {pageToShow}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === meta.totalNoOfPages}
                    className="p-2 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => handlePageChange(meta.totalNoOfPages)}
                    disabled={page === meta.totalNoOfPages}
                    className="p-2 rounded border text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLast size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  {currentBrand ? (
                    <>
                      <Edit className="mr-2 text-indigo-500" size={20} />
                      Edit Brand
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 text-indigo-500" size={20} />
                      Add New Brand
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter brand name"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Enter brand description"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Image
                  </label>

                  <div className="mt-1 flex items-center gap-5">
                    <div className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Brand preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image className="text-gray-400" size={24} />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Upload size={16} className="mr-2" />
                        {currentBrand ? "Change Image" : "Upload Image"}
                      </button>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData((prev) => ({
                              ...prev,
                              imageFile: null,
                            }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 mt-1"
                        >
                          Remove image
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createBrandMutation.isPending ||
                      updateBrandMutation.isPending
                    }
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center"
                  >
                    {createBrandMutation.isPending ||
                    updateBrandMutation.isPending ? (
                      <>
                        <RefreshCw className="animate-spin mr-2" size={16} />
                        Saving...
                      </>
                    ) : currentBrand ? (
                      <>
                        <Save className="mr-2" size={16} />
                        Update Brand
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={16} />
                        Create Brand
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && currentBrand && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Trash className="mr-2 text-red-500" size={20} />
                  Confirm Delete
                </h2>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-100 mb-5">
                <p className="text-gray-700">
                  Are you sure you want to delete{" "}
                  <strong className="text-red-600">{currentBrand.name}</strong>?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBrandMutation.mutate(currentBrand.id)}
                  disabled={deleteBrandMutation.isPending}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center"
                >
                  {deleteBrandMutation.isPending ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={16} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash className="mr-2" size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBrandsPage;
