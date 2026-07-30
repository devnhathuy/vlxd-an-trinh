import { ArrowRight, MapPin } from "lucide-react";
import { projects } from "../../data/mockData";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
export default function Projects() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Dự án tiêu biểu"
          title="Bằng chứng năng lực qua từng công trình"
          description="Một số công trình dân dụng và công nghiệp đã được An Trinh đồng hành."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary-500">
                  {p.status}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold">{p.title}</h3>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={17} />
                  {p.location}
                </p>
                <p className="mt-4 text-sm font-semibold">{p.materials}</p>
                <button className="mt-5 flex items-center gap-2 font-bold text-primary-500">
                  Xem chi tiết <ArrowRight size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-primary-500 p-8 text-center text-white md:p-12">
          <h3 className="text-2xl font-extrabold md:text-3xl">
            Bạn đang chuẩn bị xây dựng công trình?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Chúng tôi sẵn sàng tư vấn vật liệu phù hợp và gửi báo giá nhanh
            chóng.
          </p>
          <Button href="#bao-gia" variant="accent" className="mt-6">
            Nhận báo giá ngay
          </Button>
        </div>
      </div>
    </section>
  );
}
