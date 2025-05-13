import { useEffect, useState } from "react";
import { useNotification } from "../../context/GlobalNotificationContext";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import { AxiosError } from "axios";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../api/apiConfig";
import { motion, AnimatePresence } from "framer-motion";
import { truncateText } from "../../utils/TruncateText";
import { PriceFormat } from "../../utils/PriceFormat";

interface OrderItem {
  orderItem_id: number;
  order_id: number;
  product_id: number;
  orderitem_quantity: number;
  orderitem_unitprice: number;
  products: Product;
}

interface Product {
  product_id: number;
  product_name: string;
  selling_price: string;
  discount_price: string;
  product_picture: string;
}

interface Order {
  order_id: number;
  order_date: string;
  order_totalAmount: number;
  order_shippingAddress: string;
  order_status: string;
  order_paymentMethod: string;
  order_phoneNumber: string;
  order_notes: string;
  order_items: OrderItem[];
}

interface AllOrders {
  activeOrders: Order[];
  completedOrders: Order[];
  orderStatuses: []; // I'll get back to this later
}

const MyOrders = ({ title }: TitleType) => {
  setTitle(title);
  const { showNotification } = useNotification();
  useRoleRedirect(["Owner", "Admin", "Client"]);
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<AllOrders>();
  const [expandedOrders, setExpandedOrders] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const CurrentUserOrders = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/api/orders");
        setOrders(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          showNotification(error.response.data.databaseError, "databaseError");
        }
      } finally {
        setLoading(false);
      }
    };
    CurrentUserOrders();
  }, []);

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "processing":
        return "bg-blue-500 dark:bg-blue-600";
      case "shipped":
        return "bg-purple-500 dark:bg-purple-600";
      case "delivered":
        return "bg-green-500 dark:bg-green-600";
      case "cancelled":
        return "bg-red-500 dark:bg-red-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

          {/* Active Orders */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Active Orders
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({orders?.activeOrders?.length || 0})</span>
            </h2>

            {orders?.activeOrders?.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">No active orders</p>}

            {orders?.activeOrders?.map((order) => (
              <div key={order.order_id} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleOrderExpand(order.order_id)}
                  className="bg-gray-50 dark:bg-gray-900 p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="text-gray-800 dark:text-gray-200 font-medium">Order #{order.order_id}</div>
                    <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">{order.order_date}</div>
                  </div>

                  <div className="flex items-center mt-2 md:mt-0">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white {getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </div>
                    <div className="ml-4 text-gray-800 dark:text-gray-200 font-semibold">{PriceFormat(order.order_totalAmount)} Dhs</div>
                    <div className="ml-4">
                      <motion.div
                        animate={{ rotate: expandedOrders[order.order_id] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <span className="text-gray-500 dark:text-gray-400">↓</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrders[order.order_id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shipping Address</h3>
                            <p className="text-gray-800 dark:text-gray-200">{order.order_shippingAddress}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</h3>
                            <p className="text-gray-800 dark:text-gray-200">{order.order_phoneNumber}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</h3>
                            <p className="text-gray-800 dark:text-gray-200">{order.order_paymentMethod}</p>
                          </div>
                          {order.order_notes && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</h3>
                              <p className="text-gray-800 dark:text-gray-200">{truncateText(order.order_notes, 50)}</p>
                            </div>
                          )}
                        </div>

                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Items</h3>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.orderItem_id} className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                  src={BASE_API_URL + "/" + item.products.product_picture}
                                  alt={item.products.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.products.product_name}</h4>
                                <div className="flex items-center mt-1">
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.orderitem_quantity} × {PriceFormat(item.orderitem_unitprice)} Dhs
                                  </p>
                                  <p className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {PriceFormat(item.orderitem_unitprice * item.orderitem_quantity)} Dhs
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Completed Orders */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              Completed Orders
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({orders?.completedOrders?.length || 0})</span>
            </h2>

            {orders?.completedOrders?.length === 0 && <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">No completed orders</p>}

            {orders?.completedOrders?.map((order) => (
              <div key={order.order_id} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleOrderExpand(order.order_id)}
                  className="bg-gray-50 dark:bg-gray-900 p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="text-gray-800 dark:text-gray-200 font-medium">Order #{order.order_id}</div>
                    <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">{order.order_date}</div>
                  </div>

                  <div className="flex items-center mt-2 md:mt-0">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white {getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </div>
                    <div className="ml-4 text-gray-800 dark:text-gray-200 font-semibold">{PriceFormat(order.order_totalAmount)}</div>
                    <div className="ml-4">
                      <motion.div
                        animate={{ rotate: expandedOrders[order.order_id] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <span className="text-gray-500 dark:text-gray-400">↓</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrders[order.order_id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shipping Address</h3>
                            <p className="text-gray-800 dark:text-gray-200">{order.order_shippingAddress}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</h3>
                            <p className="text-gray-800 dark:text-gray-200">{order.order_phoneNumber}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</h3>
                            <p className="text-gray-800 dark:text-gray-200">{order.order_paymentMethod}</p>
                          </div>
                          {order.order_notes && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</h3>
                              <p className="text-gray-800 dark:text-gray-200">{truncateText(order.order_notes, 50)}</p>
                            </div>
                          )}
                        </div>

                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Items</h3>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.orderItem_id} className="flex items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-900">
                              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                  src={BASE_API_URL + "/" + item.products.product_picture}
                                  alt={item.products.product_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.products.product_name}</h4>
                                <div className="flex items-center mt-1">
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {PriceFormat(item.orderitem_unitprice)} × {item.orderitem_quantity}
                                  </p>
                                  <p className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {PriceFormat(item.orderitem_unitprice * item.orderitem_quantity)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
