import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { format as dateFormat } from "date-fns";
import { fetchGetAllOrderStatuses } from "../../services/OrderStatusService";
import {
  fetchGetOrderById,
  putUpdateOrderStatus,
} from "../../services/OrderService";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";

const OrderForm = () => {
  const [order, setOrder] = useState();
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [initialValues, setInitialValues] = useState({
    email: "",
    phoneNumber: "",
    createDate: "",
    paymentMethod: "",
    totalItems: "",
    totalPrice: "",
    paymentStatus: "",
    orderStatusId: "",
  });

  const { id } = useParams();

  const navigator = useNavigate();

  const getOrderById = async (id) => {
    const res = await fetchGetOrderById(id);

    if (res && res.result) {
      console.log("Order: ", res.result);
      setOrder(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      getOrderById(id);
    }
  }, [id]);

  useEffect(() => {
    if (order) {
      const user = order.user;

      setInitialValues({
        email: user.email,
        phoneNumber: user.phoneNumber,
        createDate: dateFormat(order.createDate, "dd/MM/yyyy, HH:mm:ss"),
        paymentMethod: order.paymentMethod.name,
        totalItems: order.totalItems,
        totalPrice: order.totalPrice,
        paymentStatus: order.paymentStatus.toString(),
        orderStatusId: order.orderStatus.id,
      });
    }
  }, [order]);

  const getAllOrderStatuses = async () => {
    const res = await fetchGetAllOrderStatuses();

    if (res && res.result) {
      const orderStatuses = res.result;
      setOrderStatuses(
        orderStatuses.map((orderStatus) => ({
          key: orderStatus.name,
          value: orderStatus.id,
        }))
      );
    }
  };

  useEffect(() => {
    getAllOrderStatuses();
  }, []);

  const radioOptions = [
    { key: "Paid", value: "true" },
    { key: "Not pay yet", value: "false" },
  ];

  const handleUpdateOrderStatus = async (data) => {
    const res = await putUpdateOrderStatus(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update order successfully!");
      navigator("/admin/table/orders");
    } else {
      toast.error("Error updating order!");
    }
  };

  const onSubmit = (values) => {
    console.log("Values: ", values);

    const data = {
      id: id,
      orderStatus: { id: values.orderStatusId },
      paymentStatus: values.paymentStatus,
    };

    console.log("Data: ", data);

    handleUpdateOrderStatus(data);
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Order Form</h2>
        </div>
        <div className="panel-body">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(formik) => (
              <Form className="templatemo-login-form">
                <FormikControl
                  control="input"
                  label="Create Date"
                  name="createDate"
                  readOnly
                />

                <FormikControl
                  control="input"
                  label="Email"
                  name="email"
                  readOnly
                />

                <FormikControl
                  control="input"
                  label="Phone number"
                  name="phoneNumber"
                  readOnly
                />

                <FormikControl
                  control="input"
                  label="Payment"
                  name="paymentMethod"
                  readOnly
                />

                <FormikControl
                  control="radio"
                  label="Payment Status"
                  name="paymentStatus"
                  options={radioOptions}
                />

                <FormikControl
                  control="select"
                  label="Order Status"
                  name="orderStatusId"
                  options={orderStatuses}
                />

                <div className="form-group">
                  <button
                    type="submit"
                    className="templatemo-blue-button margin-right-15"
                  >
                    Save
                  </button>
                  <button
                    type="reset"
                    className="templatemo-white-button margin-right-15"
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
