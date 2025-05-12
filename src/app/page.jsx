"use client";

import { useState, useEffect, useCallback } from "react";

function MainComponent() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    order_number: "",
    customer_name: "",
    products_shipped: "",
    notes: "",
  });

  // Fetch orders for selected date
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/get-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_date: selectedDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setOrders(data.orders);
    } catch (err) {
      console.error(err);
      setError("Could not load orders");
    }
  }, [selectedDate]);

  // Load orders when date changes
  useEffect(() => {
    fetchOrders();
  }, [selectedDate, fetchOrders]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          order_date: selectedDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Reset form and show success message
      setFormData({
        order_number: "",
        customer_name: "",
        products_shipped: "",
        notes: "",
      });
      setSuccess(true);
      fetchOrders();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Could not create order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shopify Order Tracker
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Order Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.order_number}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order_number: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customer_name: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Products Shipped *
                  </label>
                  <textarea
                    required
                    value={formData.products_shipped}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        products_shipped: e.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Order
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                Order added successfully!
              </div>
            )}
          </div>

          {/* Right Section - Order Display */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">View Orders</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No orders found for this date
                </p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">
                        Order #{order.order_number}
                      </span>
                      {order.customer_name && (
                        <span className="text-gray-600">
                          {order.customer_name}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700 mb-2">
                      {order.products_shipped}
                    </div>
                    {order.notes && (
                      <div className="text-sm text-gray-500">{order.notes}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
