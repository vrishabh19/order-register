async function handler({ order_date }) {
  try {
    const orders = await sql`
      SELECT * FROM orders 
      WHERE order_date = ${order_date}
      ORDER BY order_number
    `;

    return { orders };
  } catch (error) {
    return { error: "Failed to fetch orders" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}