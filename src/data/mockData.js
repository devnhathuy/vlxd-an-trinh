import {
  Building2,
  CircleDollarSign,
  Clock3,
  Factory,
  Gem,
  Hammer,
  HardHat,
  PackageCheck,
  PaintBucket,
  ShieldCheck,
  Sparkles,
  Truck,
  Warehouse,
  Wrench
} from "lucide-react";
export const categories = [
  { name: "Xi măng", count: 18, icon: PackageCheck },
  { name: "Sắt thép", count: 26, icon: Hammer },
  { name: "Cát đá", count: 14, icon: Gem },
{ name: "Ống nhựa", count: 22, icon: Wrench },
  { name: "Gạch", count: 30, icon: Building2 },
  { name: "Sơn", count: 16, icon: PaintBucket },
  { name: "Thiết bị vệ sinh", count: 20, icon: Wrench },
  { name: "Xem tất cả", count: 146, icon: Sparkles },
];
export const prices = [
  {
    product: "Xi măng Hà Tiên PCB40",
    unit: "Bao 50kg",
    price: "92.000đ",
    status: "Còn hàng",
  },
  {
    product: "Thép Hòa Phát D10",
    unit: "Cây",
    price: "Liên hệ",
    status: "Theo đơn",
  },
  { product: "Cát xây tô", unit: "m³", price: "390.000đ", status: "Còn hàng" },
  { product: "Đá 1x2", unit: "m³", price: "460.000đ", status: "Sắp hết" },
  {
    product: "Ống Bình Minh PVC 90",
    unit: "Cây",
    price: "Theo thị trường",
    status: "Theo đơn",
  },
];
export const products = [
  {
    name: "Xi măng Hà Tiên PCB40",
    unit: "Bao 50kg",
    price: "92.000đ",
    badge: "Bán chạy",
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Thép xây dựng Hòa Phát",
    unit: "Theo quy cách",
    price: "Liên hệ",
    badge: "Đề xuất",
    status: "Theo đơn",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gạch xây chất lượng cao",
    unit: "Viên",
    price: "1.350đ",
    badge: "Giá tốt",
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1590074072786-a66914c9e9c8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Ống nhựa PVC Bình Minh",
    unit: "Cây",
    price: "Theo quy cách",
    badge: "Mới",
    status: "Còn hàng",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
  },
];
export const advantages = [
  {
    title: "Giao hàng nhanh",
    description: "Đội xe phục vụ tận nơi tại Đức Hòa và khu vực lân cận.",
    icon: Truck,
  },
  {
    title: "Nguồn hàng ổn định",
    description: "Kho hàng đa dạng, đáp ứng công trình nhỏ đến lớn.",
    icon: Warehouse,
  },
  {
    title: "Giá cạnh tranh",
    description: "Báo giá minh bạch, cập nhật theo thị trường.",
    icon: CircleDollarSign,
  },
  {
    title: "Tư vấn tận tâm",
    description: "Hỗ trợ chọn vật liệu phù hợp nhu cầu và ngân sách.",
    icon: HardHat,
  },
];
export const stats = [
  { value: "500+", label: "Công trình" },
  { value: "300+", label: "Khách hàng" },
  { value: "15+", label: "Năm kinh nghiệm" },
  { value: "98%", label: "Khách hàng hài lòng" },
];
export const brands = [
  "Hòa Phát",
  "Hà Tiên",
  "INSEE",
  "Bình Minh",
  "Viglacera",
  "Đồng Tâm",
  "SCG",
  "Sika",
];
export const projects = [
  {
    title: "Khu dân cư Đức Hòa",
    location: "Đức Hòa, Long An",
    materials: "Xi măng • Thép • Gạch",
    status: "Đã hoàn thành",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Nhà xưởng công nghiệp",
    location: "Bến Lức, Long An",
    materials: "Thép • Tôn • Xi măng",
    status: "Đang cung cấp",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Công trình nhà phố",
    location: "Đức Hòa, Long An",
    materials: "Cát • Đá • Gạch",
    status: "Đã hoàn thành",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  },
];
export const reviews = [
  {
    name: "Nguyễn Văn Minh",
    role: "Chủ thầu xây dựng",
    content: "Giá rõ ràng, giao hàng đúng hẹn và đội ngũ hỗ trợ rất nhanh.",
    rating: 5,
  },
  {
    name: "Trần Quốc Nam",
    role: "Chủ nhà",
    content: "Tư vấn dễ hiểu, hàng giao đúng số lượng và đúng loại đã đặt.",
    rating: 5,
  },
  {
    name: "Lê Hoàng Phúc",
    role: "Đội trưởng thi công",
    content:
      "Nguồn hàng ổn định, phù hợp với các công trình cần tiến độ nhanh.",
    rating: 5,
  },
];
export const news = [
  {
    title: "Giá thép xây dựng hôm nay có biến động không?",
    category: "Cập nhật",
    date: "27/07/2026",
    readingTime: "3 phút đọc",
    image:
      "https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Xi măng PCB30 và PCB40 khác nhau thế nào?",
    category: "Kiến thức",
    date: "25/07/2026",
    readingTime: "5 phút đọc",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cách tính số lượng gạch cho nhà ở",
    category: "Kiến thức",
    date: "21/07/2026",
    readingTime: "4 phút đọc",
    image:
      "https://images.unsplash.com/photo-1590725121839-892b458a74fe?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Nên chọn cát vàng hay cát xây tô?",
    category: "Kiến thức",
    date: "18/07/2026",
    readingTime: "4 phút đọc",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
  },
];
export const commitments = [
  { title: "Báo giá nhanh trong giờ làm việc", icon: Clock3 },
  { title: "Giao hàng đúng tiến độ", icon: Truck },
  { title: "Sản phẩm nguồn gốc rõ ràng", icon: ShieldCheck },
  { title: "Đồng hành cùng mọi quy mô công trình", icon: Factory },
];
