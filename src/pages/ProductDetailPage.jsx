import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Package,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getProductBySlug,
  getRelatedProducts,
} from "../services/productService";
import Button from "../components/ui/Button";

function formatPrice(product) {
  if (product?.price !== null && product?.price !== undefined) {
    return `${Number(product.price).toLocaleString("vi-VN")}đ`;
  }

  return product?.price_note || "Liên hệ";
}

export default function ProductDetailPage() {
  const { slug } = useParams();
const [selectedImage, setSelectedImage] = useState("");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setErrorMessage("");
        setRelatedProducts([]);

        const data = await getProductBySlug(slug);

if (!data) {
  setProduct(null);
  setErrorMessage("Không tìm thấy sản phẩm hoặc sản phẩm đã bị ẩn.");
  return;
}

setProduct(data);
const firstGalleryImage = data?.product_images?.[0]?.image_url;

setSelectedImage(
  firstGalleryImage || data?.image_url || ""
);
const relatedData = await getRelatedProducts(
  data.category_id,
  data.id,
);

setRelatedProducts(relatedData);
      } catch (error) {
        console.error("Không thể tải sản phẩm:", error);
        setProduct(null);
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
const galleryImages = [
  ...(product.image_url ? [product.image_url] : []),
  ...(product.product_images || []).map((image) => image.image_url),
].filter((imageUrl, index, array) => {
  return imageUrl && array.indexOf(imageUrl) === index;
});
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
  <div className="container-custom py-5">
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link
        to="/"
        className="font-semibold transition hover:text-primary-500"
      >
        Trang chủ
      </Link>

      <span>/</span>

      <Link
        to="/san-pham"
        className="font-semibold transition hover:text-primary-500"
      >
        Sản phẩm
      </Link>

      {product.categories?.name && (
        <>
          <span>/</span>

          <span className="font-semibold text-slate-600">
            {product.categories.name}
          </span>
        </>
      )}

      <span>/</span>

      <span className="font-bold text-slate-900">
        {product.name}
      </span>
    </div>
  </div>
</section>

      <section className="section-space">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    {selectedImage ? (
      <img
        src={selectedImage}
        alt={product.name}
        className="h-[360px] w-full object-cover sm:h-[480px]"
      />
    ) : (
      <div className="grid h-[360px] place-items-center bg-slate-100 text-sm font-bold text-slate-400 sm:h-[480px]">
        Chưa có ảnh sản phẩm
      </div>
    )}
  </div>

  {galleryImages.length > 1 && (
    <div className="mt-4 grid grid-cols-4 gap-3">
      {galleryImages.map((imageUrl, index) => (
        <button
          key={`${imageUrl}-${index}`}
          type="button"
          onClick={() => setSelectedImage(imageUrl)}
          className={`overflow-hidden rounded-xl border-2 bg-slate-100 transition ${
            selectedImage === imageUrl
              ? "border-primary-500"
              : "border-transparent hover:border-slate-300"
          }`}
        >
          <img
            src={imageUrl}
            alt={`${product.name} - ảnh ${index + 1}`}
            className="h-20 w-full object-cover"
          />
        </button>
      ))}
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

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
  <a
    href="#bao-gia"
    className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 font-extrabold text-white transition hover:bg-primary-600"
  >
    Nhận báo giá
  </a>

  <a
    href="tel:0909 264 264"
    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-500 px-5 py-3 font-extrabold text-primary-500 transition hover:bg-primary-50"
  >
    <Phone size={18} />
    Gọi ngay
  </a>

  <a
    href="https://zalo.me/09 6666 7626"
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-500 px-5 py-3 font-extrabold text-blue-600 transition hover:bg-blue-50"
  >
    <MessageCircle size={18} />
    Zalo
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
      {relatedProducts.length > 0 && (
  <section className="border-t border-slate-200 bg-white py-16">
    <div className="container-custom">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary-500">
            Gợi ý thêm
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
            Sản phẩm cùng danh mục
          </h2>
        </div>

        <Link
          to="/san-pham"
          className="inline-flex items-center gap-2 font-bold text-primary-500"
        >
          Xem tất cả
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((relatedProduct) => (
          <article
            key={relatedProduct.id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-soft"
          >
            <Link
              to={`/san-pham/${relatedProduct.slug}`}
              className="block overflow-hidden bg-slate-100"
            >
              {relatedProduct.image_url ? (
                <img
                  src={relatedProduct.image_url}
                  alt={relatedProduct.name}
                  loading="lazy"
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-48 place-items-center text-sm font-bold text-slate-400">
                  Chưa có ảnh
                </div>
              )}
            </Link>

            <div className="p-5">
              <p className="text-xs font-extrabold uppercase text-primary-500">
                {relatedProduct.categories?.name || "Khác"}
              </p>

              <h3 className="mt-2 min-h-12 font-extrabold text-slate-900">
                <Link
                  to={`/san-pham/${relatedProduct.slug}`}
                  className="transition hover:text-primary-500"
                >
                  {relatedProduct.name}
                </Link>
              </h3>

              <div className="mt-4 text-lg font-black text-primary-500">
                {formatPrice(relatedProduct)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)}
    </main>
  );
}