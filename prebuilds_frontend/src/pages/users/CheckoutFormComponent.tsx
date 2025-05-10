import { useEffect, useState } from "react";
import { useSessionContext } from "../../context/SessionContext";
import { AxiosError } from "axios";
import { useNotification } from "../../context/GlobalNotificationContext";
import apiService from "../../api/apiService";
import { MaxCharacterFieldCount } from "../../utils/MaxCharacterFieldCount";
import { useCart } from "../../context/CartItemCountContext";

interface Props {
  showCheckoutForm: boolean;
  setShowCheckoutForm: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setCartItems: (value: []) => void;
}

interface FormData {
  order_shippingAddress: string;
  order_paymentMethod: string;
  order_phoneNumber: string;
  order_notes: string;
}

const CheckoutFormComponent = ({ showCheckoutForm, setShowCheckoutForm, setLoading, setCartItems }: Props) => {
    const { setCartItemCount } = useCart();
  
  const { userData } = useSessionContext();
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    order_shippingAddress: "",
    order_paymentMethod: "",
    order_phoneNumber: userData?.user_phone || "",
    order_notes: "",
  });

  useEffect(() => {
    if (showCheckoutForm) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [showCheckoutForm]);
  if (!showCheckoutForm) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);

    try {
      const response = await apiService.post("/api/orders", formData);
      showNotification(response.data.successMessage, "successMessage");
      setCartItemCount(response.data.cartItemCount)
      setCartItems([]);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    } finally {
      setLoading(false);
    }
  };

  const maxCharacters_ShippingAdress = 120;
  const maxCharacters_Phone = 12;
  const maxCharacters_Notes = 500;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          className={`transition-all duration-500 ease-out transform mt-6 w-full ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md`}
        >
          {/* Address Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Address</label>
            <input
              type="text"
              placeholder={"Your address where you'd like the merchandise delivered."}
              onChange={(e) => setFormData({ ...formData, order_shippingAddress: e.target.value })}
              onInput={(e) => MaxCharacterFieldCount(e, maxCharacters_ShippingAdress)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formData.order_shippingAddress.length} / {maxCharacters_ShippingAdress}
            </div>
          </div>

          {/* Payment Method Radio Group */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payment Method</label>
            <div className="flex space-x-6">
              <label className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <input
                  type="radio"
                  name="order_paymentMethod"
                  value={"Cash on Delivery"}
                  className="accent-blue-600"
                  checked={formData.order_paymentMethod === "Cash on Delivery"}
                  onChange={(e) => setFormData({ ...formData, order_paymentMethod: e.target.value })}
                  required
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <input
                  type="radio"
                  name="order_paymentMethod"
                  value={"Bank Transfer"}
                  className="accent-blue-600"
                  checked={formData.order_paymentMethod === "Bank Transfer"}
                  onChange={(e) => setFormData({ ...formData, order_paymentMethod: e.target.value })}
                />
                Bank Transfer
              </label>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder={"Your phone number for us to get in touch with you."}
              defaultValue={userData?.user_phone}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({ ...formData, order_phoneNumber: e.target.value })}
              onInput={(e) => MaxCharacterFieldCount(e, maxCharacters_Phone)}
              required
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formData.order_phoneNumber.length} / {maxCharacters_Phone}
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes*</label>
            <textarea
              placeholder={"(Optional) : Any additional information you'd like to request or provide regarding your order."}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              onChange={(e) => setFormData({ ...formData, order_notes: e.target.value })}
              onInput={(e) => MaxCharacterFieldCount(e, maxCharacters_Notes)}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formData.order_notes.length} / {maxCharacters_Notes}
            </div>
          </div>

          {/* Button Row */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <button
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
               rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Complete Order
            </button>

            <button
              onClick={() => setShowCheckoutForm(false)}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold 
               rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 
               focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 
               dark:focus:ring-offset-gray-800"
            >
              Close Checkout
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CheckoutFormComponent;
