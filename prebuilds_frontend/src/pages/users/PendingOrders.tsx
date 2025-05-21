import { useEffect, useState } from "react";
import { useNotification } from "../../context/GlobalNotificationContext";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import { getStatusContent, Order, Statuses } from "./MyOrders";
import { AxiosError } from "axios";
import apiService from "../../api/apiService";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_API_URL } from "../../api/apiConfig";
import LoadingSpinner from "../../components/LoadingSpinner";
import EditOrderModal from "./EditOrderModal";
import { useSessionContext } from "../../context/SessionContext";
import { Settings } from "lucide-react";

interface AllOrders {
  orders: Order[];
  activeStatuses: Statuses;
  completedStatuses: Statuses;
}

const PendingOrders = ({ title }: TitleType) => {
  setTitle(title);

  const { showNotification } = useNotification();
  useRoleRedirect(["Owner", "Admin"]);
  const [orders, setOrders] = useState<AllOrders>();
  const [expandedOrders, setExpandedOrders] = useState<{ [key: number]: boolean }>({});
  const [currentTab, setCurrentTab] = useState<"active" | "completed">("active");
  const [loading, setLoading] = useState<boolean>(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  const [orderToChange, setOrderToChange] = useState<Order>();
  const fetchOrders = async (status: string = "active") => {
    setLoading(true);
    try {
      const response = await apiService.get("/api/fetchAdminOrders/" + status);
      setOrders(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  useEffect(() => {
    fetchOrders(currentTab);
  }, [currentTab]);

  useEffect(() => {
    fetchOrders();
  }, []);
  const openChangeStatusModal = (order: Order) => {
    setOrderToChange(order);
    setShowChangeStatusModal(true);
  };

  const closeEditModal = () => {
    setShowChangeStatusModal(false);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden mb-10">
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setCurrentTab("active")}
              className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentTab === "active" ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              Active Orders
            </button>
            <button
              onClick={() => setCurrentTab("completed")}
              className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentTab === "completed" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              Completed Orders
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Orders</h1>

          {/* Loading or Order List */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="mb-10">
              {/* Section Header */}
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center">
                <span className={"w-3 h-3 rounded-full mr-2 " + (currentTab === "active" ? "bg-yellow-500" : "bg-green-500")} />
                {currentTab === "active" ? "Ongoing Orders" : "Completed Orders"}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({orders?.orders?.length || 0})</span>
              </h2>

              {/* No Orders Message */}
              {orders?.orders?.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 italic py-10">No active orders</p>}

              {/* Orders List */}
              {orders?.orders?.map((order) => {
                const status = getStatusContent(order.order_status, orders.activeStatuses, orders.completedStatuses);

                return (
                  <div key={order.order_id} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    {/* Order Header */}

                    <div
                      onClick={() => toggleOrderExpand(order.order_id)}
                      className="bg-gray-50 dark:bg-gray-900 p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                        <span className="text-gray-800 dark:text-gray-200 font-semibold">Order #{order.order_id}</span>
                        <span>|</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          #{order.user.user_id} {order.user?.user_firstname} {order.user?.user_lastname}
                        </span>
                        <span>|</span>
                        <span>{order.order_date}</span>
                        <span>|</span>
                        <span> {order.order_items.length + " Item" + (order.order_items.length > 1 ? "s" : "")} </span>
                      </div>

                      <div className="flex items-center mt-2 md:mt-0">
                        <div className={"px-3 py-1 rounded-full text-xs font-semibold text-white " + status.colorClass}>
                          {" "}
                          {status.icon} {status.label}{" "}
                        </div>
                        <div className="ml-4 text-gray-800 dark:text-gray-200 font-semibold">{order.order_totalAmount} Dhs</div>
                        {(currentTab === "active" ) && (
                          <button
                            className="bg-emerald-600 hover:bg-emerald-500 text-white py-1 px-2 rounded text-sm ml-2 transition flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openChangeStatusModal(order);
                            }}
                          >
                            <Settings size={16} />
                          </button>
                        )}

                        <motion.div
                          animate={{ rotate: expandedOrders[order.order_id] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-4 w-6 h-6 flex items-center justify-center"
                        >
                          <span className="text-gray-500 dark:text-gray-400">↓</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shipping Address:</h3>
                                <p className="text-gray-800 dark:text-gray-200">{order.order_shippingAddress}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number:</h3>
                                <p className="text-gray-800 dark:text-gray-200">{order.order_phoneNumber}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method:</h3>
                                <p className="text-gray-800 dark:text-gray-200">{order.order_paymentMethod}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Status:</h3>
                                <p className="text-gray-800 dark:text-gray-200"> {status.desc} </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes:</h3>
                                <p className="text-gray-800 dark:text-gray-200">{order.order_notes || "~No Notes Provided~"}</p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Items</h3>
                            <div className="space-y-3">
                              {order.order_items.map((item) => (
                                <div key={item.orderItem_id} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    <img
                                      src={BASE_API_URL + "/" + item.products.product_picture}
                                      alt={item.products.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.products.product_name}</h4>
                                    <div className="flex items-center mt-1">
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.orderitem_quantity} × {item.orderitem_unitprice} Dhs
                                      </p>
                                      <p className="ml-auto text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {item.orderitem_unitprice * item.orderitem_quantity} Dhs
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
                );
              })}
            </div>
          )}

          {/* Status Modal */}
          {showChangeStatusModal && orderToChange && (
            <EditOrderModal
              showChangeStatusModal={showChangeStatusModal}
              orderToChange={orderToChange}
              closeEditModal={closeEditModal}
              activeStatuses={orders?.activeStatuses || {}}
              completedStatuses={orders?.completedStatuses || {}}
              fetchOrders={fetchOrders}
              setCurrentTab={setCurrentTab}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
