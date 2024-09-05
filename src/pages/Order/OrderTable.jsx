import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { format as dateFormat } from "date-fns";
import { useNavigate } from "react-router-dom";
import { fetchGetAllOrders } from "../../services/OrderService";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);

  const navigator = useNavigate();

  const getAllOrders = async () => {
    const res = await fetchGetAllOrders();

    if (res && res.result) {
      console.log(res.result);
      setOrders(res.result);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="templatemo-content-widget white-bg">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Order Management</h2>
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
                  Date <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Total <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Order Status <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Payment Method <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Payment Status <span className="caret"></span>
                </a>
              </td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.length > 0 &&
              orders.map((order, index) => (
                <tr key={`order-${index}`}>
                  <th>{index + 1}</th>
                  <td>
                    {dateFormat(order.createDate, "dd/MM/yyyy, HH:mm:ss")}
                  </td>
                  <td style={{ minWidth: 100 }}>
                    <NumericFormat
                      value={order.totalPrice}
                      displayType="text"
                      thousandSeparator=","
                      suffix=" đ"
                    />
                  </td>
                  <td>{order.orderStatus.name}</td>
                  <td>{order.paymentMethod.name}</td>
                  <td>{order.paymentStatus ? "Paid" : "Not paid yet"}</td>
                  <td style={{ minWidth: 180 }}>
                    <button
                      className="templatemo-edit-btn"
                      onClick={() => navigator(`/admin/edit-order/${order.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="templatemo-edit-btn"
                      onClick={() =>
                        navigator(`/admin/order-details/${order.id}`)
                      }
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
