import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "../../services/productService";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import { Link } from "react-router-dom";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getFeaturedProducts();
        
        setProducts(data);
      } catch (error) {
        console.error("Không thể tải sản phẩm nổi bật:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <section className="section-space bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Sản phẩm nổi bật"
          title="Được khách hàng và nhà thầu tin dùng"
          description="Một số sản phẩm phổ biến tại khu vực Đức Hòa."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {["Tất cả", "Xi măng", "Sắt thép", "Gạch", "Ống nhựa"].map(
            (item, index) => (
              <button
                key={item}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  index === 0
                    ? "bg-primary-500 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center font-semibold text-slate-500">
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Chưa có sản phẩm nổi bật.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
  <article
    key={product.id}
    className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-soft"
  >
    <div className="relative overflow-hidden bg-slate-100">
      <Link
        to={`/san-pham/${product.slug}`}
        className="block overflow-hidden"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-56 w-full place-items-center text-sm font-bold text-slate-400">
            Chưa có ảnh
          </div>
        )}
      </Link>

      {product.badge && (
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-extrabold uppercase">
          {product.badge}
        </span>
      )}
    </div>

    <div className="p-5">
      <h3 className="min-h-14 text-lg font-extrabold">
        <Link
          to={`/san-pham/${product.slug}`}
          className="transition hover:text-primary-500"
        >
          {product.name}
        </Link>
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {product.unit || "Liên hệ"}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xl font-extrabold text-primary-500">
          {product.price !== null && product.price !== undefined
            ? `${Number(product.price).toLocaleString("vi-VN")}đ`
            : "Liên hệ"}
        </span>

        <span className="text-xs font-bold text-emerald-600">
          {product.stock_status || "Còn hàng"}
        </span>
      </div>

      <Button href="#bao-gia" className="mt-5 w-full">
        Nhận báo giá
        <ArrowRight className="ml-2" size={17} />
      </Button>
    </div>
  </article>
))}
          </div>
        )}
      </div>
    </section>
  );
}