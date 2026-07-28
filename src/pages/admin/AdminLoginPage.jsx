import { useState } from "react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!supabase) {
      setMessage({
        type: "error",
        text: "Không thể kết nối Supabase.",
      });
      return;
    }

    setLoading(true);
    setMessage({
      type: "",
      text: "",
    });

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error) {
      setMessage({
        type: "error",
        text: "Email hoặc mật khẩu không chính xác.",
      });

      setLoading(false);
      return;
    }

    navigate("/admin", {
      replace: true,
    });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl md:p-9">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-500 text-xl font-extrabold text-white">
            AT
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            Đăng nhập quản trị
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Hệ thống quản trị VLXD An Trinh
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <label className="block text-sm font-bold text-slate-700">
            Email

            <div className="relative mt-2">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@antrinh.vn"
                className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 font-normal outline-none transition focus:border-primary-500"
              />
            </div>
          </label>

          <label className="block text-sm font-bold text-slate-700">
            Mật khẩu

            <div className="relative mt-2">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 font-normal outline-none transition focus:border-primary-500"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-primary-500 px-5 py-3 font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              "Đang đăng nhập..."
            ) : (
              <>
                Đăng nhập
                <LogIn
                  className="ml-2"
                  size={18}
                />
              </>
            )}
          </button>

          {message.text && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
              {message.text}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}