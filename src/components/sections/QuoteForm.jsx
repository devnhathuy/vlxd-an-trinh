import { useState } from "react";
import { Send } from "lucide-react";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabase";

const materials = [
  "Xi măng",
  "Sắt thép",
  "Gạch",
  "Cát",
  "Đá",
  "Ống nhựa",
  "Sơn",
];

export default function QuoteForm() {
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();

    if (!supabase) {
      setMessage({
        type: "error",
        text: "Chưa kết nối được với Supabase.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = formData.get("full_name")?.trim();
    const phone = formData.get("phone")?.trim();
    const selectedMaterials = formData.getAll("materials");

    if (!fullName || !phone) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập họ tên và số điện thoại.",
      });
      return;
    }

    const payload = {
      full_name: fullName,
      phone,
      delivery_address:
        formData.get("delivery_address")?.trim() || null,
      materials: selectedMaterials,
      estimated_quantity:
        formData.get("estimated_quantity")?.trim() || null,
      note: formData.get("note")?.trim() || null,
      status: "Mới tiếp nhận",
    };

    setSubmitting(true);
    setMessage({
      type: "",
      text: "",
    });

    const { error } = await supabase
      .from("quotation_requests")
      .insert([payload]);

    if (error) {
      console.error("Lỗi gửi báo giá:", error);

      setMessage({
        type: "error",
        text: `Không thể gửi yêu cầu: ${error.message}`,
      });

      setSubmitting(false);
      return;
    }

    form.reset();

    setMessage({
      type: "success",
      text: "Đã gửi yêu cầu báo giá thành công.",
    });

    setSubmitting(false);
  }

  return (
    <section
      id="bao-gia"
      className="section-space bg-primary-500"
    >
      <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
        <div className="text-white">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-200">
            Yêu cầu báo giá
          </p>

          <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
            Nhận báo giá nhanh cho công trình
          </h2>

          <p className="mt-5 leading-7 text-blue-100">
            Điền thông tin nhu cầu, đội ngũ An Trinh sẽ liên
            hệ tư vấn và gửi báo giá phù hợp.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Họ và tên

              <input
                name="full_name"
                required
                placeholder="Nguyễn Văn A"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
              />
            </label>

            <label className="text-sm font-bold">
              Số điện thoại

              <input
                name="phone"
                required
                type="tel"
                placeholder="09xxxxxxxx"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-bold">
            Địa điểm giao hàng

            <input
              name="delivery_address"
              placeholder="Đức Hòa, Long An"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
            />
          </label>

          <div className="mt-5">
            <div className="text-sm font-bold">
              Bạn cần vật liệu gì?
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {materials.map((material) => (
                <label
                  key={material}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm transition hover:border-primary-500 hover:bg-blue-50"
                >
                  <input
                    name="materials"
                    type="checkbox"
                    value={material}
                  />

                  {material}
                </label>
              ))}
            </div>
          </div>

          <label className="mt-5 block text-sm font-bold">
            Số lượng dự kiến

            <input
              name="estimated_quantity"
              placeholder="Ví dụ: 100 bao xi măng"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
            />
          </label>

          <label className="mt-5 block text-sm font-bold">
            Ghi chú

            <textarea
              name="note"
              rows="4"
              placeholder="Thông tin thêm về công trình..."
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
            />
          </label>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Đang gửi..."
              : "Gửi yêu cầu báo giá"}

            {!submitting && (
              <Send className="ml-2" size={18} />
            )}
          </Button>

          {message.text && (
            <p
              className={`mt-4 rounded-xl p-3 text-sm font-semibold ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}