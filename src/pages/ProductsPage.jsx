import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  PackageSearch,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import CategoryFilter from "../components/products/CategoryFilter";

function formatPrice(product) {
  if (product.price !== null && product.price !== undefined) {
    return `${Number(product.price).toLocaleString("vi-VN")}đ`;
  }

  return product.price_note || "Liên hệ";
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortType, setSortType] = useState("default");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPageData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [productData, categoryData] = await Promise.all([
          getActiveProducts(),
          getCategories(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Lỗi tải trang sản phẩm:", error);
        setErrorMessage("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name?.toLowerCase().includes(keyword) ||
        product.categories?.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword);

const matchesCategory =
  selectedCategory === "all" ||
  product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortType === "price-asc") {
      return [...result].sort(
        (firstProduct, secondProduct) =>
          Number(firstProduct.price ?? 0) -
          Number(secondProduct.price ?? 0),
      );
    }

    if (sortType === "price-desc") {
      return [...result].sort(
        (firstProduct, secondProduct) =>
          Number(secondProduct.price ?? 0) -
          Number(firstProduct.price ?? 0),
      );
    }

    if (sortType === "name-asc") {
      return [...result].sort((firstProduct, secondProduct) =>
        firstProduct.name.localeCompare(secondProduct.name, "vi"),
      );
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortType]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-primary-500 py-16 text-white">
        <div className="container-custom">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue-100">
            Vật liệu xây dựng An Trình
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Danh sách sản phẩm
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-blue-100">
            Tìm kiếm vật liệu xây dựng, kiểm tra giá tham khảo và liên hệ nhận
            báo giá theo số lượng thực tế.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="font-semibold hover:text-primary-500">
              Trang chủ
            </Link>

            <span>/</span>

            <span className="font-bold text-slate-800">Sản phẩm</span>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-custom">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Tìm xi măng, sắt thép, gạch..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-primary-500"
                />
              </div>

              <div className="relative">
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={sortType}
                  onChange={(event) => setSortType(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 outline-none transition focus:border-primary-500"
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="name-asc">Tên A–Z</option>
                </select>
              </div>
            </div>

           <CategoryFilter
  categories={categories}
  selectedCategory={selectedCategory}
  onChange={setSelectedCategory}
/>
</div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Tìm thấy{" "}
              <span className="font-extrabold text-slate-800">
                {filteredProducts.length}
              </span>{" "}
              sản phẩm
            </p>

            {(searchTerm || selectedCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="text-sm font-bold text-primary-500 hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="mt-8 rounded-2xl bg-rose-50 p-5 font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center font-semibold text-slate-500">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <PackageSearch
                size={48}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-5 text-xl font-extrabold text-slate-800">
                Không tìm thấy sản phẩm
              </h2>

              <p className="mt-2 text-slate-500">
                Hãy thử từ khóa hoặc danh mục khác.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <Link
                    to={`/san-pham/${product.slug}`}
                    className="relative block overflow-hidden bg-slate-100"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-56 place-items-center text-sm font-bold text-slate-400">
                        Chưa có ảnh
                      </div>
                    )}

                    {product.badge && (
                      <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold uppercase text-slate-900">
                        {product.badge}
                      </span>
                    )}
                  </Link>

                  <div className="p-5">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-primary-500">
                      {product.categories?.name || "Khác"}
                    </p>

                    <h2 className="mt-2 min-h-14 text-lg font-extrabold text-slate-900">
                      <Link
                        to={`/san-pham/${product.slug}`}
                        className="transition hover:text-primary-500"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Đơn vị: {product.unit || "Liên hệ"}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xl font-black text-primary-500">
                        {formatPrice(product)}
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          product.stock_status === "Hết hàng"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {product.stock_status || "Liên hệ"}
                      </span>
                    </div>

                    <Link
                      to={`/san-pham/${product.slug}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 font-extrabold text-white transition hover:bg-primary-600"
                    >
                      Xem chi tiết
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}