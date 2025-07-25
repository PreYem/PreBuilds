import { ThemeProvider } from "./context/ThemeContext";
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";
import Register from "./pages/users/Register";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/users/Login";
import Footer from "./components/Footer";
import useUserCheck from "./hooks/useUserCheck";
import EditUser from "./pages/users/EditUser";
import LoadingSpinner from "./components/LoadingSpinner";
import UserManagement from "./pages/users/UsersDashboard";
import CategoriesList from "./pages/categories/CategoriesList";
import AddCategory from "./pages/categories/AddCategory";
import SubCategoriesList from "./pages/subcategories/SubCategoriesList";
import AddSubCategory from "./pages/subcategories/AddSubCategory";
import AddProduct from "./pages/products/AddProduct";
import GlobalSettings from "./pages/GlobalSettings";
import { useSessionContext } from "./context/SessionContext";
import PageNotFound from "./pages/PageNotFound";
import AlertNotification from "./pages/AlertNotification";
import ShoppingCart from "./pages/users/ShoppingCart";
import MyOrders from "./pages/users/MyOrders";
import PendingOrders from "./pages/users/PendingOrders";
import ProductPage from "./pages/products/ProductPage";
import ForgotPasswordForm from "./pages/users/password-forgoten/ForgotPasswordForm";
import VerifyToken from "./pages/users/password-forgoten/VerifyToken";
import ResetPasswordForm from "./pages/users/password-forgoten/ResetPassword";

const App = () => {
  const { userData, loading } = useSessionContext();
  useUserCheck();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen">
          <TopNavbar /> {/* Navigation bar on the top for all users */}
          <AdminNavBar /> {/* Admin Navigation Bar on the right */}
          <AlertNotification /> {/* The global alert component */}
          <div className="p-6 mx-auto h-2/5">
            <Routes>
              <Route path={""} element={<Home title={"Home"} />} />
              <Route path={"/register"} element={<Register title={"Sign Up"} />} />
              <Route path={"/login"} element={<Login title={"Sign In"} />} />
              <Route path={"/EditUser/:user_id"} element={userData ? <EditUser title={userData.user_firstname} /> : <Navigate to={"*"} />} />
              <Route path={"/UsersDashboard"} element={<UserManagement title={"Users Dashboard"} />} />
              <Route path={"/CategoriesList"} element={<CategoriesList title={"Categories"} />} />
              <Route path={"/SubCategoriesList"} element={<SubCategoriesList title={"Sub-Categories"} />} />
              <Route path={"/AddCategory"} element={<AddCategory title={"Add Category"} />} />
              <Route path={"/AddSubCategory"} element={<AddSubCategory title={"Add Sub-Category"} />} />
              <Route path={"/:category"} element={<Home title={"Home"} />} />
              <Route path={"/AddProduct"} element={<AddProduct title={"Add Product"} />} />
              <Route path={"/p/:product_string"} element={<ProductPage />} />
              <Route path={"/PreBuildsSettings"} element={<GlobalSettings title={"Global Settings"} />} />
              <Route path={"/ShoppingCart"} element={<ShoppingCart title={"Your Shopping Cart"} />} />
              <Route path={"/MyOrders"} element={<MyOrders title={"Your Current Orders"} />} />
              <Route path={"/PendingOrders"} element={<PendingOrders title={"Pending Orders"} />} />
              <Route path={"/forgot-password"} element={<ForgotPasswordForm title={"Reset your password"} />} />
              <Route path={"/verify-token"} element={<VerifyToken title={"Enter token sent to your email"} />} />
              <Route path={"/reset-password"} element={<ResetPasswordForm title={"Reset your password"} />} />
              <Route path={"*"} element={<PageNotFound title={"Page Not Found"} />} /> {/*For none-existing pages*/}
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
