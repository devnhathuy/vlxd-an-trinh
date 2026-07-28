import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Package, Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../services/productService";
import Button from "../components/ui/Button";

function formatPrice(product) {
  if (product?.price !== null && product?.price !== undefined) {
    return `${Number(product.price).toLocaleString("vi-VN")}đ`;
  }

  return product?.price_note || "Liên hệ";
}

export default function ProductDetailPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error("Không thể tải sản phẩm:", error);
        setErrorMessage("Không tìm thấy sản phẩm hoặc sản phẩm đã bị ẩn.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-custom py-24 text-center">
          <p className="font-semibold text-slate-500">
            Đang tải sản phẩm...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container-custom py-24 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Không tìm thấy sản phẩm
          </h1>

          <p className="mt-3 text-slate-500">
            {errorMessage}
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 font-bold text-primary-500"
          >
            <ArrowLeft size={18} />
            Quay về trang chủ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-custom py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-primary-500"
          >
            <ArrowLeft size={17} />
            Quay về trang chủ
          </Link>
        </div>
      </section>

      <section className="section-space">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-[360px] w-full object-cover sm:h-[480px]"
                />
              ) : (
                <div className="grid h-[360px] place-items-center bg-slate-100 text-sm font-bold text-slate-400 sm:h-[480px]">
                  Chưa có ảnh sản phẩm
                </div>
              )}
            </div>

            <div>
              {product.badge && (
                <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-extrabold uppercase text-amber-700">
                  {product.badge}
                </span>
              )}

              <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-3xl font-black text-primary-500">
                  {formatPrice(product)}
                </span>

                {product.unit && (
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                    Đơn vị: {product.unit}
                  </span>
                )}
              </div>

              {product.price_note && (
                <p className="mt-3 text-sm text-slate-500">
                  {product.price_note}
                </p>
              )}

              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <CheckCircle2 className="text-emerald-600" size={22} />

                <div>
                  <p className="text-sm font-extrabold text-emerald-700">
                    {product.stock_status || "Liên hệ kiểm tra"}
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    Vui lòng liên hệ để xác nhận số lượng và giá giao hàng.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
                  <Package size={20} className="text-primary-500" />
                  Thông tin sản phẩm
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                  {product.description ||
                    "Thông tin chi tiết đang được cập nhật. Vui lòng liên hệ Vật liệu xây dựng An Trình để được tư vấn."}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button href="#bao-gia" className="w-full">
                  Nhận báo giá
                </Button>

                <a
                  href="tel:0909 264 264"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-500 px-5 py-3 font-extrabold text-primary-500 transition hover:bg-primary-50"
                >
                  <Phone size={18} />
                  Gọi tư vấn
                </a>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-500">
                Giá thực tế có thể thay đổi theo số lượng, địa điểm giao hàng
                và biến động của thị trường.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}