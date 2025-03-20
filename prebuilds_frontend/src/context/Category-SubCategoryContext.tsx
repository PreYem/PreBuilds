import { createContext, useContext, useEffect, useState } from "react";
import apiService from "../api/apiService";

interface Category {
  category_id: number;
  category_name: string;
  category_description: string;
  category_display_order: number;
}

interface SubCategory {
  subcategory_id: number;
  subcategory_name: string;
  subcategory_description: string;
  subcategory_display_order: number;
  category_id: number;
}

interface CategoriesContextType {
  categories: Category[]; // Categories List
  subCategories: SubCategory[]; //  Sub-Categories List
  loading: boolean; // Loading State when fetching from backend
  fetchCategories: () => void; // Category + Sub-Category fetching function

  // CRUD Operations on Categories and SubCategories
  addCategory: (category: Category) => void;
  updateCategory: (updatedCategory: Category) => void;
  deleteCategory: (category_id: number) => void;

  addSubCategory: (subcategory: SubCategory) => void;
  updateSubCategory: (updatedSubCategory: SubCategory) => void;
  deleteSubCategory: (subcategory_id: number) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    apiService
      .get("/api/NavBarCategories")
      .then((response) => {
        // Sort categories by category_display_order before setting them to state
        const sortedCategories = response.data.categories.sort((a: Category, b: Category) => a.category_display_order - b.category_display_order);

        const sortedSubCategories = response.data.subcategories.sort(
          (a: SubCategory, b: SubCategory) => a.subcategory_display_order - b.subcategory_display_order
        );

        setCategories(sortedCategories);
        setSubCategories(sortedSubCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // CRUD Operations on Categories

  const addCategory = (category: Category) => {
    setCategories((previousCategories) => {
      const updatedCategories = [...previousCategories, category];
      return updatedCategories.sort((a, b) => a.category_display_order - b.category_display_order);
    });
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories((previousCategories) => {
      const updatedCategories = previousCategories.map((category) =>
        category.category_id === updatedCategory.category_id ? updatedCategory : category
      );
      return updatedCategories.sort((a, b) => a.category_display_order - b.category_display_order);
    });
  };

  const deleteCategory = (category_id: number) => {
    setCategories((previousCategories) => previousCategories.filter((category) => category.category_id !== category_id));
  };

  // CRUD Operations on Sub-Categories

  const addSubCategory = (subcategory: SubCategory) => {
    setSubCategories((prev) => {
      const updatedSubCategories = [...prev, subcategory];
      return updatedSubCategories.sort((a, b) => a.subcategory_display_order - b.subcategory_display_order);
    });
  };

  const updateSubCategory = (updatedSubCategory: SubCategory) => {
    setSubCategories((prev) => {
      const updatedSubCategories = prev.map((sub) => (sub.subcategory_id === updatedSubCategory.subcategory_id ? updatedSubCategory : sub));
      // Sort after updating
      return updatedSubCategories.sort((a, b) => a.subcategory_display_order - b.subcategory_display_order);
    });
  };

  const deleteSubCategory = (subcategory_id: number) => {
    setSubCategories((prev) => prev.filter((sub) => sub.subcategory_id !== subcategory_id));
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        subCategories,
        loading,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error("useCategories must be used within a CategoriesProvider");
  return context;
};
