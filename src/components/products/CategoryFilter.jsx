export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`rounded-full px-4 py-2 text-sm font-bold transition ${
          selectedCategory === "all"
            ? "bg-primary-500 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Tất cả
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            selectedCategory === category.id
              ? "bg-primary-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}