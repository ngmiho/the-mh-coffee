import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import DrinkTable from "./pages/Drink/DrinkTable";
import DrinkForm from "./pages/Drink/DrinkForm";
import CategoryTable from "./pages/Category/CategoryTable";
import CategoryForm from "./pages/Category/CategoryForm";
import ToppingTable from "./pages/Topping/ToppingTable";
import ToppingForm from "./pages/Topping/ToppingForm";
import SizeTable from "./pages/Size/SizeTable";
import SizeForm from "./pages/Size/SizeForm";
import BankTable from "./pages/Bank/BankTable";
import BankForm from "./pages/Bank/BankForm";
import PaymentMethodTable from "./pages/PaymentMethod/PaymentMethodTable";
import PaymentMethodForm from "./pages/PaymentMethod/PaymentMethodForm";
import PaymentMethodBankTable from "./pages/PaymentMethodBank/PaymentMethodBankTable";
import PaymentMethodBankForm from "./pages/PaymentMethodBank/PaymentMethodBankForm";
import VoucherTypeTable from "./pages/VoucherType/VoucherTypeTable";
import VoucherTypeForm from "./pages/VoucherType/VoucherTypeForm";
import VoucherTable from "./pages/Voucher/VoucherTable";
import VoucherForm from "./pages/Voucher/VoucherForm";
import OrderTable from "./pages/Order/OrderTable";
import OrderDetails from "./pages/Order/OrderDetails";
import OrderForm from "./pages/Order/OrderForm";
import UserTable from "./pages/User/UserTable";
import UserForm from "./pages/User/UserForm";
import FormikContainer from "./components/FormikContainer/FormikContainer";
import DrinkTableAnt from "./pages/Drink/DrinkTableAnt";
import OrderTableAnt from "./pages/Order/OrderTableAnt";
import ChartJS from "./pages/ChartJSTutorial/ChartJS";
import UserTableAnt from "./pages/User/UserTableAnt";
import ReviewTable from "./pages/Review/ReviewTable";
import Login from "./pages/Login/Login";
import { StoreContext } from "./context/StoreContext";
import OrderByStaff from "./pages/OrderByStaff/OrderByStaff";

const App = () => {
  const { pathname } = useLocation();
  const { token, setToken } = useContext(StoreContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <>
      <div className="templatemo-flex-row" style={{ minHeight: 800 }}>
        {token && <SideBar />}

        {/* Main content */}
        <div className="templatemo-content col-1 light-gray-bg">
          {/* Top Navigation Bar */}
          {token && <NavBar />}

          {/* Content */}
          <div className="templatemo-content-container">
            <Routes>
              <Route path="/admin/drinks" element={<DrinkTable />}></Route>
              <Route path="/admin/drinks/add" element={<DrinkForm />}></Route>
              <Route
                path="/admin/edit-drink/:id"
                element={<DrinkForm />}
              ></Route>

              <Route
                path="/admin/categories"
                element={<CategoryTable />}
              ></Route>
              <Route
                path="/admin/categories/add"
                element={<CategoryForm />}
              ></Route>
              <Route
                path="/admin/edit-category/:id"
                element={<CategoryForm />}
              ></Route>

              <Route path="/admin/toppings" element={<ToppingTable />}></Route>
              <Route
                path="/admin/toppings/add"
                element={<ToppingForm />}
              ></Route>
              <Route
                path="/admin/edit-topping/:id"
                element={<ToppingForm />}
              ></Route>

              <Route path="/admin/users" element={<UserTable />}></Route>
              <Route path="/admin/users/add" element={<UserForm />}></Route>
              <Route path="/admin/edit-user/:id" element={<UserForm />}></Route>

              <Route path="/admin/sizes" element={<SizeTable />}></Route>
              <Route path="/admin/sizes/add" element={<SizeForm />}></Route>
              <Route path="/admin/edit-size/:id" element={<SizeForm />}></Route>

              <Route path="/admin/banks" element={<BankTable />}></Route>
              <Route path="/admin/banks/add" element={<BankForm />}></Route>
              <Route path="/admin/edit-bank/:id" element={<BankForm />}></Route>

              <Route
                path="/admin/payment-methods"
                element={<PaymentMethodTable />}
              ></Route>
              <Route
                path="/admin/payment-methods/add"
                element={<PaymentMethodForm />}
              ></Route>
              <Route
                path="/admin/edit-payment-method/:id"
                element={<PaymentMethodForm />}
              ></Route>

              <Route
                path="/admin/payment-method-banks"
                element={<PaymentMethodBankTable />}
              ></Route>
              <Route
                path="/admin/payment-method-banks/add"
                element={<PaymentMethodBankForm />}
              ></Route>
              <Route
                path="/admin/edit-payment-method-bank/:id"
                element={<PaymentMethodBankForm />}
              ></Route>

              <Route
                path="/admin/voucher-types"
                element={<VoucherTypeTable />}
              ></Route>
              <Route
                path="/admin/voucher-types/add"
                element={<VoucherTypeForm />}
              ></Route>
              <Route
                path="/admin/edit-voucher-type/:id"
                element={<VoucherTypeForm />}
              ></Route>

              <Route path="/admin/vouchers" element={<VoucherTable />}></Route>
              <Route
                path="/admin/vouchers/add"
                element={<VoucherForm />}
              ></Route>
              <Route
                path="/admin/edit-voucher/:id"
                element={<VoucherForm />}
              ></Route>

              <Route path="/admin/orders" element={<OrderTable />}></Route>
              <Route
                path="/admin/order-details/:id"
                element={<OrderDetails />}
              ></Route>
              <Route
                path="/admin/edit-order/:id"
                element={<OrderForm />}
              ></Route>

              <Route path="/admin/form" element={<FormikContainer />}></Route>
              <Route
                path="/admin/table/drinks"
                element={<DrinkTableAnt />}
              ></Route>
              <Route
                path="/admin/table/orders"
                element={<OrderTableAnt />}
              ></Route>

              <Route
                path="/admin/table/users"
                element={<UserTableAnt />}
              ></Route>
              <Route path="/admin/reviews" element={<ReviewTable />}></Route>

              <Route path="/admin/dashboard" element={<ChartJS />}></Route>
              <Route path="/admin/login" element={<Login />}></Route>
              <Route path="/" element={<Login />}></Route>
              <Route
                path="/admin/staff/order"
                element={<OrderByStaff />}
              ></Route>
            </Routes>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>

      {/* Tostify */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </>
  );
};

export default App;
