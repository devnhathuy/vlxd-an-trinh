import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getActiveProducts } from "../../services/productService";
import SectionHeading from "../ui/SectionHeading";

const statusClasses = {
  "Còn hàng": "bg-emerald-100 text-emerald-700",
  "Sắp hết": "bg-amber-100 text-amber-700",
  "Hết hàng": "bg-rose-100 text-rose-700",
  "Theo đơn": "bg-blue-100 text-blue-700",
};

function formatPrice(product) {
  if (product.price !== null && product.price !== undefined) {
    return `${Number(product.price).toLocaleString("vi-VN")}đ`;
  }

  return product.price_note || "Liên hệ";
}

export default function PriceTable() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getActiveProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi tải bảng giá:", error);
        setErrorMessage("Không thể tải bảng giá.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(keyword) ||
        product.unit?.toLowerCase().includes(keyword) ||
        product.stock_status?.toLowerCase().includes(keyword)
      );
    });
  }, [products, searchTerm]);

  return (
    <section className="section-space bg-slate-50">
      <div className="container-custom">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading
            center={false}
            eyebrow="Bảng giá hôm nay"
            title="Theo dõi giá vật liệu mới nhất"
            description="Giá có thể thay đổi theo thị trường, số lượng và địa điểm giao hàng."
          />

          <div className="relative mb-10 w-full lg:max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-primary-500"
              placeholder="Tìm sản phẩm..."
            />
          </div>
        </div>

        {errorMessage && (
          <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {errorMessage}
          </p>
        )}

        {loading ? (
          <div className="py-16 text-center font-semibold text-slate-500">
            Đang tải bảng giá...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            Không tìm thấy sản phẩm.
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <table className="w-full">
                <thead className="bg-primary-500 text-left text-sm text-white">
                  <tr>
                    <th className="px-6 py-4">Sản phẩm</th>
                    <th className="px-6 py-4">Đơn vị</th>
                    <th className="px-6 py-4">Giá tham khảo</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-slate-100 hover:bg-blue-50/50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[10px] text-slate-400">
                                Chưa có ảnh
                              </div>
                            )}
                          </div>

                          <span className="font-bold text-slate-800">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {product.unit || "—"}
                      </td>

                      <td className="px-6 py-5 font-extrabold text-primary-500">
                        {formatPrice(product)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusClasses[product.stock_status] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {product.stock_status || "Chưa cập nhật"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] text-slate-400">
                          Chưa có ảnh
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-extrabold">
                        {product.name}
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {product.unit || "Chưa có đơn vị"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-extrabold text-primary-500">
                      {formatPrice(product)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusClasses[product.stock_status] ??
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {product.stock_status || "Chưa cập nhật"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}