import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import BASE_URL from "../../../../config";
import { Plus, Search, Trash2, Pencil, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';


const MenuManagement = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [isCatEdit, setIsCatEdit] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  /* ---------- MODAL STATE ---------- */
  const [showModal, setShowModal] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);

  const [catShowModal, setCatShowModal] = useState(false);

  const accessToken = localStorage.getItem("accessToken")

  const [filteredCategories, setFilteredCategories] = useState([]);


  /* ---------- FORM STATE ---------- */
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    status: "available",

  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
  });

   const [catFormData, setCatFormData] = useState({
    name: "",
  });

  const [activeTab, setActiveTab] = useState("items");


  /* ---------------- FETCH DATA ---------------- */

  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}menu-categories/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    setCategories(res.data);
    console.log("menu categories", res.data)
  };

  const fetchItems = async () => {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}menu-items/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    setItems(res.data);
    console.log("menu items", res.data)
    setFilteredItems(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  /* ---------------- FILTER ---------------- */

useEffect(() => {
    if (activeTab === "items") {
      let data = items;

      if (selectedCategory !== "all") {
        data = data.filter(
          (item) => item.category?.id === Number(selectedCategory)
        );
      }

      if (search) {
        data = data.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredItems(data);
    }

    if (activeTab === "categories") {
      let data = categories;

      if (selectedCategory !== "all") {
        data = data.filter(
          (cat) => cat.id === Number(selectedCategory)
        );
      }

      if (search) {
        data = data.filter((cat) =>
          cat.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFilteredCategories(data);
    }
    setCurrentPage(1)
  }, [search, selectedCategory, items, categories, activeTab]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

   // categories
  const indexOfLastCat = currentPage * itemsPerPage;
  const indexOfFirstCat = indexOfLastCat - itemsPerPage;

  const currentCategories = filteredCategories.slice(
    indexOfFirstCat,
    indexOfLastCat
  );

  const totalCategoryPages = Math.ceil(
    filteredCategories.length / itemsPerPage
  );


  /* ---------------- CREATE ITEM ---------------- */

  const createMenuItem = async () => {
    const trimmedName = formData.name.trim().toLowerCase();

    if (!trimmedName || !formData.price || !formData.category_id) {
      toast.warn("Please fill all required fields");
      return;
    }

     const alreadyExists = items.some(
      (item) =>
        item.name.toLowerCase() === trimmedName &&
        item.category?.id === Number(formData.category_id)
    );

    if (alreadyExists) {
      toast.error("Item already exists in this category.");
      return;
    }

    if (
      Number(formData.price) <= 0
    ) {
      toast.warn("Price must be greater than 0");
      return;
    }

    await axios.post(`${BASE_URL}menu-items/`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    toast.success("Menu item created successfully ");

    setShowModal(false);
    setFormData({ name: "", price: "", description: "", category_id: "" });
    fetchItems();
  };

  const createMenuCategory = async () => {
    const trimmedName = categoryFormData.name.trim().toLowerCase();

    if (!trimmedName) {
      toast.warn("Please fill required fields");
      return;
    }

    const alreadyExists = categories.some(
      (cat) => cat.name.toLowerCase() === trimmedName
    );

    if (alreadyExists) {
      toast.error("Category name already exists. Please use a unique name.");
      return;
    }

    await axios.post(`${BASE_URL}menu-categories/`, categoryFormData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    toast.success("Menu Category created successfully ");

    setShowModalCategory(false);
    setCategoryFormData({ name: "" });
    fetchItems();
  };


  /* ---------------- DELETE ---------------- */

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`${BASE_URL}menu-items/?id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }); {
      toast.success("Menu item deleted")
      return;
    }

    fetchItems();
  };

   // delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this Category?")) return;
    await axios.delete(`${BASE_URL}menu-categories/${id}/`); {
      toast.success("Menu category deleted")
      fetchCategories();

    }

  };

  //   ---------------------EDIT ITEM----------
  const updateMenuItem = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.warn("Please fill all required fields");
      return;
    }

    try {
      await axios.put(`${BASE_URL}menu-items/${editingItemId}/`, {
        // id: editingItemId,
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category_id: Number(formData.category_id),

        // ✅ IMPORTANT FIX
        is_available: formData.status === "available",
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      toast.success("Item updated successfully ✅");

      setShowModal(false);
      setIsEdit(false);
      setEditingItemId(null);

      setFormData({
        name: "",
        price: "",
        description: "",
        category_id: "",
        status: "available",

      });

      fetchItems();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Update failed ❌");
    }
  };

    const updateMenuCategory = async () => {
    if (!catFormData.name.trim()) {
      toast.warn("Category name is required");
      return;
    }

    const alreadyExists = categories.some(
      (cat) =>
        cat.id !== editingCatId &&
        cat.name.toLowerCase() === catFormData.name.trim().toLowerCase()
    );

    if (alreadyExists) {
      toast.error("Category already exists");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL}menu-categories/${editingCatId}/`,
        {
          name: catFormData.name.trim(),
        }
      );

      toast.success("Category updated successfully");

      setCatShowModal(false);
      setIsCatEdit(false);
      setEditingCatId(null);
      setCatFormData({ name: "" });

      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await axios.patch(`${BASE_URL}toggle_item_availability/${item.id}/`, {
        is_available: !item.is_available,
      });

      toast.success("Item status updated");

      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

   useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <>
      <ToastContainer autoClose={1000} position="top-center" />

      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Menu Management</h2>
            <p className="text-gray-500 text-sm">
              Manage your restaurant menu items
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Responsive Add Button (menu category) */}
            <button
              onClick={() => {
                setCategoryFormData({
                  name: "",
                });
                setShowModalCategory(true);
              }}
              className="w-full md:w-auto text-sm md:text-md bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Menu Category
            </button>

            {/* Responsive Add Button (menu item) */}
            <button
              onClick={() => {
                setIsEdit(false);
                setEditingItemId(null);
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  category_id: "",
                  status: "available",
                });
                setShowModal(true);
              }}
              className="w-full md:w-auto text-sm md:text-md bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Menu Item
            </button>
          </div>
        </div>


        {/* ================= FILTERS ================= */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="pl-9 pr-3 py-2 border bg-white rounded-md w-full"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border bg-white px-3 py-2 rounded-md w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

         <div className="flex gap-6 border-b mb-4">
          <button
            onClick={() => setActiveTab("items")}
            className={`pb-2 ${activeTab === "items"
              ? "border-b-2 border-orange-500 text-orange-600 font-semibold"
              : "text-gray-500"
              }`}
          >
            Items
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-2 ${activeTab === "categories"
              ? "border-b-2 border-orange-500 text-orange-600 font-semibold"
              : "text-gray-500"
              }`}
          >
            Categories
          </button>
        </div>


 {activeTab === "items" && (
          <>
        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden grid grid-cols-1 gap-4 mb-6">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow border p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-base">{item.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${item.is_available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {item.is_available ? "Available" : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                {item.description || "No description"}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-orange-600 font-semibold">
                  ₹{item.price}
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                  {item.category?.name}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsEdit(true);
                    setEditingItemId(item.id);
                    setFormData({
                      name: item.name,
                      price: item.price,
                      description: item.description,
                      category_id: item.category?.id || "",
                      status: item.is_available
                        ? "available"
                        : "out_of_stock",
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 border px-3 py-2 rounded-md text-sm hover:bg-orange-500 hover:text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 mb-2 flex-wrap">

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                    ? "bg-orange-500 text-white"
                    : "border"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>

            </div>
          )}

        </div>


        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Item Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.description}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {item.category?.name}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-orange-600">
                    ₹{item.price}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${item.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.is_available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300
                               ${item.is_available ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow transform transition duration-300
                               ${item.is_available ? "translate-x-4" : "translate-x-0"}`}
                        />
                      </button>

                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setEditingItemId(item.id);
                          setFormData({
                            name: item.name,
                            price: item.price,
                            description: item.description,
                            category_id: item.category?.id || "",
                            status: item.is_available
                              ? "available"
                              : "out_of_stock",
                          });
                          setShowModal(true);
                        }}
                        className="bg-gray-100 text-gray-700 border px-3 py-1.5 rounded-md text-sm flex items-center gap-1 hover:bg-orange-600 hover:text-white transition"
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 mb-2 flex-wrap">

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                    ? "bg-orange-500 text-white"
                    : "border"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>

            </div>
          )}

        </div>


        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-lg">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>

              <div className="space-y-4">
                <select
                  className="w-full border bg-white text-black px-4 py-2 rounded-md"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Item Name"
                  className="w-full border bg-white px-4 py-2 rounded-md"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Price"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  className="w-full border no-spinner bg-white px-4 py-2 rounded-md"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Description"
                  className="w-full border bg-white px-4 py-2 rounded-md"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={
                      isEdit ? updateMenuItem : createMenuItem
                    }
                    className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2 rounded-md"
                  >
                    {isEdit ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} 
         </>
        )}

{/* categories tab */}
        {activeTab === "categories" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentCategories.map((cat) => {
                const count = items.filter(
                  (item) => item.category?.id === cat.id
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="bg-white p-4 rounded-xl shadow border"
                  >
                    <h3
                      className="font-semibold text-lg truncate"
                      title={cat.name}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500">{count} items</p>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => {
                          setIsCatEdit(true);
                          setEditingCatId(cat.id);
                          setCatFormData({ name: cat.name });
                          setCatShowModal(true);
                        }}
                        className="px-3 py-1 border rounded-md text-sm">
                        Edit
                      </button>

                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {catShowModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-lg">
                  <button
                    onClick={() => setCatShowModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-xl font-bold mb-4">
                    {isCatEdit ? "Edit Category" : "Add New Category"}
                  </h2>

                  <div className="space-y-4">
                    <input
                      placeholder="Category Name"
                      className="w-full border bg-white px-4 py-2 rounded-md"
                      value={catFormData.name}
                      onChange={(e) => {
                        setCatFormData({
                          ...catFormData,
                          name: e.target.value,
                        });
                      }}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setCatShowModal(false)}
                        className="px-4 py-2 rounded-md border"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={
                          isCatEdit ? updateMenuCategory : createMenuCategory
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                      >
                        {isCatEdit ? "Update" : "Create"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            )}

            {totalCategoryPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalCategoryPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                      ? "bg-orange-500 text-white"
                      : "border"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalCategoryPages)
                    )
                  }
                  disabled={currentPage === totalCategoryPages}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* category modal */}
        {showModalCategory && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-lg">
              <button
                onClick={() => setShowModalCategory(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">
                Add New Menu Category
              </h2>

              <div className="space-y-4">
                <input
                  placeholder="Category Name"
                  className="w-full border bg-white px-4 py-2 rounded-md"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({
                      ...categoryFormData,
                      name: e.target.value,
                    })
                  }
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowModalCategory(false)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={createMenuCategory}
                    className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2 rounded-md"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MenuManagement;


