import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
const stats = [
  ["500+", "Công trình"],
  ["15+", "Năm kinh nghiệm"],
  ["1000+", "m² kho hàng"],
  ["24/7", "Hỗ trợ"],
];
export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-white via-blue-50 to-slate-100">
      <div className="container-custom grid min-h-[720px] items-center gap-12 py-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-primary-500">
            <CheckCircle2 size={18} />
            Phục vụ Đức Hòa và khu vực lân cận
          </div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Nhà phân phối{" "}
            <span className="text-gradient">vật liệu xây dựng</span> uy tín tại
            Đức Hòa
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Cung cấp xi măng, sắt thép, gạch, cát đá, ống nhựa và nhiều loại vật
            liệu cho công trình dân dụng, nhà xưởng và dự án.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/san-pham">
              Xem sản phẩm <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button href="#bao-gia" variant="outline">
              Nhận báo giá
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl font-extrabold text-primary-500">
                  {v}
                </div>
                <div className="text-xs font-semibold text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85"
            alt="Kho vật liệu xây dựng"
            className="h-[520px] w-full rounded-[2rem] object-cover shadow-soft"
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-5 shadow-xl">
            <div className="font-extrabold">Nguồn hàng ổn định mỗi ngày</div>
            <p className="mt-1 text-sm text-slate-600">
              Tư vấn, giao hàng và báo giá nhanh.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
