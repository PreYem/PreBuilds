import { useEffect, useState } from "react";

interface Props {
  showCheckoutForm: boolean;
  setShowCheckoutForm: (value: boolean) => void;
}

interface FormData {
    ShippingAddress: string;
    PaymentMethod:string;
    PhoneNumber: string;
    Notes: string

}

const CheckoutFormComponent = ({ showCheckoutForm, setShowCheckoutForm }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData[]>([])

  useEffect(() => {
    if (showCheckoutForm) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [showCheckoutForm]);

  if (!showCheckoutForm) return null;

  return (
    <>
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
            placeholder="Enter delivery address"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Payment Method Radio Group */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Payment Method</label>
          <div className="flex space-x-6">
            <label className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <input type="radio" name="payment" value="cash" className="accent-blue-600" defaultChecked />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <input type="radio" name="payment" value="bank" className="accent-blue-600" />
              Bank Transfer
            </label>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="e.g. 07XXXXXXXX"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes Textarea */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Notes</label>
          <textarea
            placeholder="Any notes for the seller..."
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
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
    </>
  );
};

export default CheckoutFormComponent;
