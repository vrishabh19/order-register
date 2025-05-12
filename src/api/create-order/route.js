async function handler({
  order_number,
  customer_name,
  products_shipped,
  notes,
  order_date,
}) {
  try {
    const result = await sql`
      INSERT INTO orders (order_number, customer_name, products_shipped, notes, order_date)
      VALUES (${order_number}, ${customer_name}, ${products_shipped}, ${notes}, ${
      order_date || new Date()
    })
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    return { error: "Failed to create order" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}