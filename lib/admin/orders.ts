import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { OrderWithItems, OrderStatus } from "@/lib/types";

export async function getAllOrdersForAdmin(): Promise<OrderWithItems[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as OrderWithItems[];
}

export async function getOrderForAdmin(
  id: string,
): Promise<OrderWithItems | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as OrderWithItems | null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// order_items and payments both reference orders(id) on delete cascade,
// so deleting the order row alone is enough to clean up both.
export async function deleteOrder(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}
