export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type HomeFeatureImage = {
  id: string;
  position: number;
  image_url: string | null;
  label: string | null;
  product_id: string | null;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  is_active: boolean;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string | null;
  stock_quantity: number;
  weight_grams: number;
  is_active: boolean;
};

export type ProductWithVariants = Product & {
  product_variants: ProductVariant[];
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "payment_failed";

export type Order = {
  id: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_city: string;
  shipping_branch: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  paid_at: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  size: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};
