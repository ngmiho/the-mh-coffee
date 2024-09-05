import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { fetchGetOrderById } from "../../services/OrderService";
import { Form, Formik } from "formik";
import FormikControl from "../../components/FormControl/FormikControl";

const OrderDetails = () => {
  const [order, setOrder] = useState();
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    paymentMethod: "",
    address: {
      streetNumber: "",
      ward: "",
      district: "",
      province: "",
    },
  });

  const { id } = useParams();

  const getOrderById = async (id) => {
    const res = await fetchGetOrderById(id);

    if (res && res.result) {
      console.log("Result: ", res.result);
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

      let address = null;
      if (order.address != null) {
        address = {
          streetNumber: order.address.streetNumber,
          ward: order.address.ward,
          district: order.address.district,
          province: order.address.province,
        };
      }

      setInitialValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        paymentMethod: order.paymentMethod.name,
        address,
      });
    }
  }, [order]);

  return (
    <>
      <div className="templatemo-content-widget white-bg">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Order Details</h2>
        </div>
        <div className="panel panel-default table-responsive">
          <table className="table table-striped table-bordered templatemo-user-table">
            <thead>
              <tr>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    # <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Drink Name <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Price <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Size <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Topping <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Quantity <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Total <span className="caret"></span>
                  </a>
                </td>
              </tr>
            </thead>
            <tbody>
              {order &&
                order.orderItems &&
                order.orderItems.map((orderItem, index) => (
                  <tr key={`order-item-${index}`}>
                    <th>{index + 1}</th>
                    <td>{orderItem.drink.name}</td>
                    <td>
                      <NumericFormat
                        value={orderItem.price / orderItem.quantity}
                        displayType="text"
                        thousandSeparator=","
                        suffix=" đ"
                      />
                    </td>
                    <td>
                      <span>{orderItem.size && orderItem.size.character}</span>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      <div className="">
                        {orderItem.toppings.length > 0 &&
                          orderItem.toppings.map((topping) => (
                            <span
                              key={`topping-${topping.id}`}
                              style={{ margin: 5 }}
                            >
                              {topping.name}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td>{orderItem.quantity}</td>
                    <td>
                      <NumericFormat
                        value={orderItem.price}
                        displayType="text"
                        thousandSeparator=","
                        suffix=" đ"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="templatemo-flex-row flex-content-row">
        <div className="col-1">
          <div className="panel panel-default margin-10">
            <div className="panel-heading">
              <h2 className="text-uppercase">Delivery Information</h2>
            </div>
            <div className="panel-body">
              {order && (
                <Formik initialValues={initialValues} enableReinitialize>
                  {(formik) => (
                    <Form className="templatemo-login-form">
                      <div className="row form-group">
                        <div className="col-lg-6 col-md-6">
                          <FormikControl
                            control="input"
                            label="First name"
                            name="firstName"
                            readOnly
                          />
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <FormikControl
                            control="input"
                            label="Last name"
                            name="lastName"
                            readOnly
                          />
                        </div>
                      </div>

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
                        label="Street number"
                        name="address.streetNumber"
                        readOnly
                      />

                      <div className="row form-group">
                        <div className="col-md-4">
                          <FormikControl
                            control="input"
                            label="Ward"
                            name="address.ward"
                            readOnly
                          />
                        </div>
                        <div className="col-md-4">
                          <FormikControl
                            control="input"
                            label="District"
                            name="address.district"
                            readOnly
                          />
                        </div>
                        <div className="col-md-4">
                          <FormikControl
                            control="input"
                            label="Province"
                            name="address.province"
                            readOnly
                          />
                        </div>
                      </div>

                      <FormikControl
                        control="input"
                        label="Payment"
                        name="paymentMethod"
                        readOnly
                      />
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
        <div className="col-1">
          <div className="panel panel-default margin-10">
            <div className="panel-heading">
              <h2 className="text-uppercase">Order Totals</h2>
            </div>
            {order && (
              <div className="panel-body">
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td style={{ paddingLeft: 0 }}>Quantity</td>
                        <td style={{ paddingRight: 0, textAlign: "right" }}>
                          {order.totalItems}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: 0 }}>Subtotal</td>
                        <td style={{ paddingRight: 0, textAlign: "right" }}>
                          <NumericFormat
                            value={order.totalPrice}
                            displayType="text"
                            thousandSeparator=","
                            suffix=" đ"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: 0 }}>Delivery Fee</td>
                        <td style={{ paddingRight: 0, textAlign: "right" }}>
                          Free
                        </td>
                      </tr>
                      <tr>
                        <th style={{ paddingLeft: 0 }}>Total</th>
                        <th style={{ paddingRight: 0, textAlign: "right" }}>
                          <NumericFormat
                            value={order.totalPrice}
                            displayType="text"
                            thousandSeparator=","
                            suffix=" đ"
                          />
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
