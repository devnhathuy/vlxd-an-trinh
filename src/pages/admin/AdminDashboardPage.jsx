import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Clock3,
  LogOut,
  Phone,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const statuses = [
  "Mới tiếp nhận",
  "Đã liên hệ",
  "Đang báo giá",
  "Đã chốt",
  "Đã hủy",
];

const statusStyles = {
  "Mới tiếp nhận": "bg-blue-100 text-blue-700",
  "Đã liên hệ": "bg-violet-100 text-violet-700",
  "Đang báo giá": "bg-amber-100 text-amber-700",
  "Đã chốt": "bg-emerald-100 text-emerald-700",
  "Đã hủy": "bg-rose-100 text-rose-700",
};

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchQuotes() {
    if (!supabase) {
      setErrorMessage("Không thể kết nối Supabase.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("quotation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi tải báo giá:", error);
      setErrorMessage(`Không thể tải báo giá: ${error.message}`);
      setLoading(false);
      return;
    }

    setQuotes(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    setErrorMessage("");

    const { error } = await supabase
      .from("quotation_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      setErrorMessage(`Không thể cập nhật: ${error.message}`);
      setUpdatingId(null);
      return;
    }

    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === id
          ? {
              ...quote,
              status: newStatus,
            }
          : quote,
      ),
    );

    setUpdatingId(null);
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    navigate("/admin/login", {
      replace: true,
    });
  }

  const filteredQuotes = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesStatus =
        statusFilter === "Tất cả" ||
        quote.status === statusFilter;

      const matchesSearch =
        !keyword ||
        quote.full_name?.toLowerCase().includes(keyword) ||
        quote.phone?.toLowerCase().includes(keyword) ||
        quote.delivery_address
          ?.toLowerCase()
          .includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [quotes, searchTerm, statusFilter]);

  const newQuoteCount = quotes.filter(
    (quote) => quote.status === "Mới tiếp nhận",
  ).length;

  const closedQuoteCount = quotes.filter(
    (quote) => quote.status === "Đã chốt",
  ).length;

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-extrabold text-primary-500">
              VLXD An Trinh Admin
            </h1>

            <p className="text-sm text-slate-500">
              Quản lý yêu cầu báo giá
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
  to="/admin/products"
  className="flex items-center rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white hover:bg-primary-600"
>
  Quản lý sản phẩm
</Link>
            <button
              type="button"
              onClick={fetchQuotes}
              className="flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="mr-2" size={17} />
              Làm mới
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="mr-2" size={17} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Tổng yêu cầu
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {quotes.length}
                </p>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-primary-500">
                <ClipboardList size={24} />
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Mới tiếp nhận
                </p>

                <p className="mt-2 text-3xl font-extrabold text-blue-600">
                  {newQuoteCount}
                </p>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Clock3 size={24} />
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Đã chốt
                </p>

                <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {closedQuoteCount}
                </p>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                <UserRound size={24} />
              </div>
            </div>
          </article>
        </div>

        <div className="mt-7 rounded-3xl bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Yêu cầu báo giá
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tiếp nhận và cập nhật trạng thái khách hàng.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Tìm tên, SĐT, địa chỉ..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary-500 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary-500"
              >
                <option value="Tất cả">Tất cả trạng thái</option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
              {errorMessage}
            </p>
          )}

          {loading ? (
            <div className="py-16 text-center font-semibold text-slate-500">
              Đang tải yêu cầu báo giá...
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Chưa có yêu cầu báo giá phù hợp.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-[1050px] w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-4">Khách hàng</th>
                    <th className="px-4 py-4">Liên hệ</th>
                    <th className="px-4 py-4">Vật liệu</th>
                    <th className="px-4 py-4">Số lượng</th>
                    <th className="px-4 py-4">Ghi chú</th>
                    <th className="px-4 py-4">Ngày gửi</th>
                    <th className="px-4 py-4">Trạng thái</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="border-b border-slate-100 align-top hover:bg-slate-50"
                    >
                      <td className="px-4 py-5">
                        <div className="font-bold text-slate-900">
                          {quote.full_name || "Không có tên"}
                        </div>

                        <div className="mt-1 max-w-52 text-sm text-slate-500">
                          {quote.delivery_address || "Chưa có địa chỉ"}
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <a
                          href={`tel:${quote.phone}`}
                          className="inline-flex items-center font-bold text-primary-500"
                        >
                          <Phone className="mr-2" size={16} />
                          {quote.phone}
                        </a>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex max-w-60 flex-wrap gap-2">
                          {quote.materials?.length ? (
                            quote.materials.map((material) => (
                              <span
                                key={material}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                              >
                                {material}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-5 text-sm text-slate-700">
                        {quote.estimated_quantity || "—"}
                      </td>

                      <td className="px-4 py-5">
                        <p className="max-w-60 whitespace-pre-wrap text-sm text-slate-600">
                          {quote.note || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-5 text-sm text-slate-600">
                        {formatDate(quote.created_at)}
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[quote.status] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {quote.status || "Mới tiếp nhận"}
                        </span>

                        <select
                          value={quote.status || "Mới tiếp nhận"}
                          disabled={updatingId === quote.id}
                          onChange={(event) =>
                            handleStatusChange(
                              quote.id,
                              event.target.value,
                            )
                          }
                          className="block min-w-36 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-primary-500 disabled:opacity-50"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}