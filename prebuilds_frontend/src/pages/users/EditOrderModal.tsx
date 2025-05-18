import { useRef, useState } from "react";
import { BASE_API_URL } from "../../api/apiConfig";
import useCloseModal from "../../hooks/useCloseModal";
import { PriceFormat } from "../../utils/PriceFormat";
import { getStatusContent, Order, Statuses } from "./MyOrders";

interface Props {
  showChangeStatusModal: boolean;
  orderToChange: Order;
  closeEditModal: () => void;
  activeStatuses: Statuses;
  completedStatuses: Statuses;
}

const EditOrderModal = ({ showChangeStatusModal, orderToChange, closeEditModal, activeStatuses, completedStatuses }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!showChangeStatusModal) return null;
  const [status, setStatus] = useState<string>(orderToChange.order_status);

  useCloseModal(modalRef, closeEditModal);

  const statusContent = getStatusContent(orderToChange.order_status, activeStatuses, completedStatuses);

  const handleChangeStatus = async () => {
    closeEditModal();
  };

  return (
    <>
      <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="relative bg-white dark:bg-gray-800 p-8 rounded-lg w-1/2 max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out"
          ref={modalRef}
        >
          {/* Close X button */}
          <button
            onClick={closeEditModal}
            className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-label="Close modal"
          >
            &#10005; {/* Unicode for × */}
          </button>

          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order #{orderToChange.order_id}</h1>

          <div className="mb-2 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Date:</span> <strong>{orderToChange.order_date}</strong>
          </div>

          <div className="mb-4 text-gray-700 dark:text-gray-300">
            <span className="font-medium">Total :</span> <strong>{PriceFormat(orderToChange.order_totalAmount)} Dhs</strong>
          </div>

          <div className={`${statusContent.colorClass} px-3 py-1 rounded inline-flex items-center mb-6`}>
            <span className="mr-2">{statusContent.icon}</span>
            <strong>{statusContent.label}</strong>
          </div>

          <div className="space-y-4 mb-6">
            {orderToChange.order_items.map((order_item) => (
              <div
                key={order_item.orderItem_id}
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded"
              >
                <div className="flex items-center space-x-4 mb-2 md:mb-0">
                  <img
                    src={BASE_API_URL + "/" + order_item.products.product_picture}
                    alt={order_item.products.product_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div className="text-gray-900 dark:text-gray-100 font-semibold">{order_item.products.product_name}</div>
                    <div className="text-gray-700 dark:text-gray-300">
                      {" "}
                      {order_item.orderitem_quantity} × {order_item.orderitem_unitprice} Dhs{" "}
                    </div>{" "}
                    {/* moved here */}
                  </div>
                </div>

                <div className="text-gray-900 dark:text-gray-100 font-semibold">
                  Total: {PriceFormat(order_item.orderitem_quantity * order_item.orderitem_unitprice)} Dhs
                </div>
              </div>
            ))}
          </div>

          {/* Select + Save Button Container */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center space-x-4 max-w-xs w-full">
              <select
                id="order_status"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                // onChange handler to be added by you
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <optgroup label="Active Statuses" className="text-gray-700 dark:text-gray-300">
                  {Object.keys(activeStatuses).map((status) => {
                    const statusInfo = getStatusContent(status, activeStatuses, completedStatuses);
                    return (
                      <option key={status} value={status}>
                        {statusInfo.icon} {statusInfo.label}
                      </option>
                    );
                  })}
                </optgroup>

                <optgroup label="Completed Statuses" className="text-gray-700 dark:text-gray-300">
                  {Object.keys(completedStatuses).map((status) => {
                    const statusInfo = getStatusContent(status, activeStatuses, completedStatuses);
                    return (
                      <option key={status} value={status}>
                        {statusInfo.icon} {statusInfo.label}
                      </option>
                    );
                  })}
                </optgroup>
              </select>

              <button
                type="button"
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                // onClick handler to be added by you
                onClick={handleChangeStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOrderModal;
