import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash, ChevronDown, ChevronRight } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, getAllSubcategories } from '../../api/categories';
import { createSubcategory, updateSubcategory, deleteSubcategory } from '../../api/categories';
import { Category, Subcategory } from '../../types';

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [deleteType, setDeleteType] = useState<'category' | 'subcategory'>('category');
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 10),
  });
  
  // Fetch subcategories
  const { data: allSubcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ['allSubcategories'],
    queryFn: () => getAllSubcategories(),
  });
  
  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setIsCategoryModalOpen(false);
      setCategoryName('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
  
  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setIsCategoryModalOpen(false);
      setCategoryName('');
      setCurrentCategory(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    },
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['allSubcategories'] });
      toast.success('Category deleted successfully');
      setIsDeleteModalOpen(false);
      setCurrentCategory(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
  
  // Create subcategory mutation
  const createSubcategoryMutation = useMutation({
    mutationFn: ({ name, categoryId }: { name: string; categoryId: number }) => 
      createSubcategory(name, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSubcategories'] });
      toast.success('Subcategory created successfully');
      setIsSubcategoryModalOpen(false);
      setSubcategoryName('');
      setSelectedCategoryId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create subcategory');
    },
  });
  
  // Update subcategory mutation
  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ id, name, categoryId }: { id: number; name: string; categoryId: number }) => 
      updateSubcategory(id, name, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSubcategories'] });
      toast.success('Subcategory updated successfully');
      setIsSubcategoryModalOpen(false);
      setSubcategoryName('');
      setSelectedCategoryId(null);
      setCurrentSubcategory(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update subcategory');
    },
  });
  
  // Delete subcategory mutation
  const deleteSubcategoryMutation = useMutation({
    mutationFn: (id: number) => deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSubcategories'] });
      toast.success('Subcategory deleted successfully');
      setIsDeleteModalOpen(false);
      setCurrentSubcategory(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete subcategory');
    },
  });
  
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const openCreateCategoryModal = () => {
    setCurrentCategory(null);
    setCategoryName('');
    setIsCategoryModalOpen(true);
  };
  
  const openEditCategoryModal = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setIsCategoryModalOpen(true);
  };
  
  const openCreateSubcategoryModal = (categoryId: number) => {
    setCurrentSubcategory(null);
    setSubcategoryName('');
    setSelectedCategoryId(categoryId);
    setIsSubcategoryModalOpen(true);
  };
  
  const openEditSubcategoryModal = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setSelectedCategoryId(subcategory.categoryId);
    setIsSubcategoryModalOpen(true);
  };
  
  const openDeleteModal = (type: 'category' | 'subcategory', item: Category | Subcategory) => {
    setDeleteType(type);
    if (type === 'category') {
      setCurrentCategory(item as Category);
      setCurrentSubcategory(null);
    } else {
      setCurrentSubcategory(item as Subcategory);
      setCurrentCategory(null);
    }
    setIsDeleteModalOpen(true);
  };
  
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    if (currentCategory) {
      updateCategoryMutation.mutate({ id: currentCategory.id, name: categoryName });
    } else {
      createCategoryMutation.mutate(categoryName);
    }
  };
  
  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcategoryName.trim() || !selectedCategoryId) return;
    
    if (currentSubcategory) {
      updateSubcategoryMutation.mutate({
        id: currentSubcategory.id,
        name: subcategoryName,
        categoryId: selectedCategoryId,
      });
    } else {
      createSubcategoryMutation.mutate({
        name: subcategoryName,
        categoryId: selectedCategoryId,
      });
    }
  };
  
  const handleDelete = () => {
    if (deleteType === 'category' && currentCategory) {
      deleteCategoryMutation.mutate(currentCategory.id);
    } else if (deleteType === 'subcategory' && currentSubcategory) {
      deleteSubcategoryMutation.mutate(currentSubcategory.id);
    }
  };
  
  // Group subcategories by category
  const subcategoriesByCategory = allSubcategories?.reduce((acc, subcategory) => {
    if (!acc[subcategory.categoryId]) {
      acc[subcategory.categoryId] = [];
    }
    acc[subcategory.categoryId].push(subcategory);
    return acc;
  }, {} as Record<number, Subcategory[]>) || {};
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories & Subcategories</h1>
        <button
          onClick={openCreateCategoryModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Category
        </button>
      </div>
      
      {/* Categories List */}
      {categoriesLoading || subcategoriesLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {categories?.map((category) => (
              <li key={category.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown size={20} className="text-gray-500 mr-2" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-500 mr-2" />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openCreateSubcategoryModal(category.id)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Add Subcategory"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => openEditCategoryModal(category)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit Category"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal('category', category)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete Category"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Subcategories */}
                {expandedCategories.includes(category.id) && (
                  <ul className="mt-2 pl-8 space-y-2">
                    {subcategoriesByCategory[category.id]?.map((subcategory) => (
                      <li key={subcategory.id} className="flex justify-between items-center py-1">
                        <span className="text-gray-700">{subcategory.name}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditSubcategoryModal(subcategory)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Edit Subcategory"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal('subcategory', subcategory)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete Subcategory"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                    
                    {!subcategoriesByCategory[category.id] || subcategoriesByCategory[category.id].length === 0 ? (
                      <li className="text-gray-500 italic">No subcategories</li>
                    ) : null}
                  </ul>
                )}
              </li>
            ))}
            
            {categories?.length === 0 && (
              <li className="p-4 text-center text-gray-500">
                No categories found
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending
                    ? 'Saving...'
                    : currentCategory
                    ? 'Update Category'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Subcategory Modal */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {currentSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h2>
            
            <form onSubmit={handleSubcategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={selectedCategoryId || ''}
                  onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsSubcategoryModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubcategoryMutation.isPending || updateSubcategoryMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70"
                >
                  {createSubcategoryMutation.isPending || updateSubcategoryMutation.isPending
                    ? 'Saving...'
                    : currentSubcategory
                    ? 'Update Subcategory'
                    : 'Create Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete{' '}
              <strong>
                {deleteType === 'category'
                  ? currentCategory?.name
                  : currentSubcategory?.name}
              </strong>
              ? This action cannot be undone.
              {deleteType === 'category' && (
                <span className="block mt-2 text-red-600">
                  Warning: This will also delete all subcategories under this category!
                </span>
              )}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteCategoryMutation.isPending || deleteSubcategoryMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70"
              >
                {deleteCategoryMutation.isPending || deleteSubcategoryMutation.isPending
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;