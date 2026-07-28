import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const emptyForm = {
  name: "",
  slug: "",
  image_url: "",
  unit: "",
  price: "",
  price_note: "",
  stock_status: "Còn hàng",
  badge: "",
  is_featured: false,
  is_active: true,
};

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  async function fetchProducts() {
    if (!supabase) {
      setMessage({
        type: "error",
        text: "Không thể kết nối Supabase.",
      });

      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: `Không thể tải sản phẩm: ${error.message}`,
      });

      setLoading(false);
      return;
    }

    setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => {
      const nextValue = type === "checkbox" ? checked : value;

      const nextForm = {
        ...current,
        [name]: nextValue,
      };

      if (
        name === "name" &&
        (!editingId || current.slug === createSlug(current.name))
      ) {
        nextForm.slug = createSlug(value);
      }

      return nextForm;
    });
  }

  function openCreateForm() {
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
setImagePreview("");
    setMessage({
      type: "",
      text: "",
    });
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingId(product.id);

    setFormData({
        image_url: product.image_url ?? "",
      name: product.name ?? "",
      slug: product.slug ?? "",
      unit: product.unit ?? "",
      price:
        product.price === null || product.price === undefined
          ? ""
          : product.price,
      price_note: product.price_note ?? "",
      stock_status: product.stock_status ?? "Còn hàng",
      badge: product.badge ?? "",
      is_featured: Boolean(product.is_featured),
      is_active: Boolean(product.is_active),
    });
setImageFile(null);
setImagePreview(product.image_url ?? "");
    setMessage({
      type: "",
      text: "",
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setImageFile(null);
setImagePreview("");
  }
function handleImageChange(event) {
  const file = event.target.files?.[0];

  if (!file) {
    setImageFile(null);
    setImagePreview(formData.image_url || "");
    return;
  }

  if (!file.type.startsWith("image/")) {
    setMessage({
      type: "error",
      text: "Vui lòng chọn đúng file hình ảnh.",
    });
    return;
  }

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
}
async function uploadProductImage(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
async function uploadProductImage(file) {
  const extension = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(`products/${fileName}`, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(`products/${fileName}`);

  return data.publicUrl;
}
  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập tên sản phẩm.",
      });
      return;
    }

    const slug = formData.slug.trim() || createSlug(formData.name);

    if (!slug) {
      setMessage({
        type: "error",
        text: "Không thể tạo đường dẫn sản phẩm.",
      });
      return;
    }

    const parsedPrice =
      formData.price === ""
        ? null
        : Number(formData.price);

    if (
      parsedPrice !== null &&
      (!Number.isFinite(parsedPrice) || parsedPrice < 0)
    ) {
      setMessage({
        type: "error",
        text: "Giá sản phẩm không hợp lệ.",
      });
      return;
    }
        setSaving(true);
    setMessage({
      type: "",
      text: "",
    });
let image_url = formData.image_url || null;

if (imageFile) {
  try {
    image_url = await uploadProductImage(imageFile);
  } catch (uploadError) {
    console.error("Lỗi upload ảnh:", uploadError);

    setMessage({
      type: "error",
      text: `Không thể upload ảnh: ${uploadError.message}`,
    });

    setSaving(false);
    return;
  }
}
    const payload = {
      name: formData.name.trim(),
      slug,
      image_url,
      unit: formData.unit.trim() || null,
      price: parsedPrice,
      price_note: formData.price_note.trim() || null,
      stock_status: formData.stock_status,
      badge: formData.badge.trim() || null,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    let result;

    if (editingId) {
      result = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("products")
        .insert(payload);
    }

    if (result.error) {
      console.error(result.error);

      setMessage({
        type: "error",
        text: `Không thể lưu sản phẩm: ${result.error.message}`,
      });

      setSaving(false);
      return;
    }

    setMessage({
      type: "success",
      text: editingId
        ? "Đã cập nhật sản phẩm."
        : "Đã thêm sản phẩm.",
    });

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);

    await fetchProducts();
  }

  async function handleToggleActive(product) {
    const { error } = await supabase
      .from("products")
      .update({
        is_active: !product.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (error) {
      setMessage({
        type: "error",
        text: `Không thể đổi trạng thái: ${error.message}`,
      });
      return;
    }

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              is_active: !item.is_active,
            }
          : item,
      ),
    );
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Bạn chắc chắn muốn xóa sản phẩm "${product.name}"?`,
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: `Không thể xóa sản phẩm: ${error.message}`,
      });

      setDeletingId(null);
      return;
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id),
    );

    setMessage({
      type: "success",
      text: "Đã xóa sản phẩm.",
    });

    setDeletingId(null);
  }

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(keyword) ||
        product.slug?.toLowerCase().includes(keyword) ||
        product.unit?.toLowerCase().includes(keyword)
      );
    });
  }, [products, searchTerm]);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <Link
              to="/admin"
              className="mb-1 inline-flex items-center text-sm font-bold text-primary-500"
            >
              <ArrowLeft className="mr-2" size={17} />
              Quay lại báo giá
            </Link>

            <h1 className="text-xl font-extrabold text-slate-900">
              Quản lý sản phẩm
            </h1>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
          >
            <Plus className="mr-2" size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message.text && (
          <p
            className={`mb-5 rounded-xl p-4 text-sm font-semibold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Danh sách sản phẩm
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tổng cộng {products.length} sản phẩm.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary-500 md:w-80"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center font-semibold text-slate-500">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Chưa có sản phẩm.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-4">Sản phẩm</th>
                    <th className="px-4 py-4">Đơn vị</th>
                    <th className="px-4 py-4">Giá</th>
                    <th className="px-4 py-4">Kho hàng</th>
                    <th className="px-4 py-4">Nổi bật</th>
                    <th className="px-4 py-4">Hiển thị</th>
                    <th className="px-4 py-4 text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-5">
  <div className="flex min-w-72 items-center gap-4">
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-xs font-bold text-slate-400">
          Chưa có ảnh
        </div>
      )}
    </div>

    <div>
      <p className="font-bold text-slate-900">
        {product.name}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        /{product.slug}
      </p>

      {product.badge && (
        <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700">
          {product.badge}
        </span>
      )}
    </div>
  </div>
</td>

                      <td className="px-4 py-5 text-sm text-slate-600">
                        {product.unit || "—"}
                      </td>

                      <td className="px-4 py-5">
                        <p className="font-extrabold text-primary-500">
                          {formatPrice(product.price)}
                        </p>

                        {product.price_note && (
                          <p className="mt-1 text-xs text-slate-500">
                            {product.price_note}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-5 text-sm font-semibold text-slate-700">
                        {product.stock_status || "—"}
                      </td>

                      <td className="px-4 py-5">
                        {product.is_featured ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            Nổi bật
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Không
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(product)
                          }
                          className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-bold ${
                            product.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {product.is_active ? (
                            <>
                              <Eye className="mr-2" size={15} />
                              Đang hiện
                            </>
                          ) : (
                            <>
                              <EyeOff className="mr-2" size={15} />
                              Đang ẩn
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-primary-500 transition hover:bg-blue-50"
                            aria-label="Sửa sản phẩm"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === product.id}
                            onClick={() => handleDelete(product)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                            aria-label="Xóa sản phẩm"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {editingId
                    ? "Sửa sản phẩm"
                    : "Thêm sản phẩm"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Nhập thông tin sản phẩm bên dưới.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
                <div>
  <label className="block text-sm font-bold text-slate-700">
    Ảnh sản phẩm
  </label>

  <div className="mt-2 rounded-2xl border border-dashed border-slate-300 p-4">
    <input
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onChange={handleImageChange}
      className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:font-bold file:text-primary-500"
    />

    <p className="mt-2 text-xs text-slate-500">
      Chấp nhận JPG, PNG hoặc WebP. Dung lượng tối đa 5MB.
    </p>

    {imagePreview && (
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <img
          src={imagePreview}
          alt="Xem trước sản phẩm"
          className="h-56 w-full object-cover"
        />
      </div>
    )}
  </div>
</div>
              <label className="block text-sm font-bold text-slate-700">
                Tên sản phẩm *

                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Xi măng Hà Tiên PCB40"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Slug

                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="xi-mang-ha-tien-pcb40"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  Đơn vị

                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Bao 50kg"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Giá

                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="92000"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  />
                </label>
              </div>

              <label className="block text-sm font-bold text-slate-700">
                Ghi chú giá

                <input
                  name="price_note"
                  value={formData.price_note}
                  onChange={handleChange}
                  placeholder="Giá thay đổi theo số lượng"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  Trạng thái kho

                  <select
                    name="stock_status"
                    value={formData.stock_status}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  >
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Sắp hết">Sắp hết</option>
                    <option value="Theo đơn">Theo đơn</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Nhãn sản phẩm

                  <input
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    placeholder="Bán chạy"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />

                  Sản phẩm nổi bật
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />

                  Hiển thị trên website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
                >
                  {saving
                    ? "Đang lưu..."
                    : editingId
                      ? "Lưu thay đổi"
                      : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}