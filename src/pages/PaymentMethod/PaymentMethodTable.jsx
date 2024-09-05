import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchAllPaymentMethods,
  deletePaymentMethodById,
} from "../../services/PaymentMethodService";
import { Space, Table } from "antd";

const PaymentMethodTable = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const getAllPaymentMethods = async () => {
    const res = await fetchAllPaymentMethods();

    if (res && res.result) {
      const data = res.result.map((element, index) => ({
        ...element,
        key: index + 1,
      }));
      console.log(data);
      setPaymentMethods(data);
    }
  };

  useEffect(() => {
    getAllPaymentMethods();
  }, []);

  const navigator = useNavigate();

  const deletePaymentMethod = async (id) => {
    const res = await deletePaymentMethodById(id);

    if (res && res.message) {
      toast.success(res.message);
    } else {
      toast.error("Error deleting a payment method!");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (_, paymentMethod) => (
        <Space size="middle">
          <button
            className="templatemo-edit-btn"
            onClick={() =>
              navigator(`/admin/edit-payment-methods/${paymentMethod.id}`)
            }
          >
            Edit
          </button>
          <button
            className="templatemo-delete-btn"
            onClick={() => deletePaymentMethod(paymentMethod.id)}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

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
        <h2>Payment Method Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/payment-methods/add")}
        >
          Add new payment method
        </button>
      </div>
      <div className="panel panel-default table-responsive">
        <Table columns={columns} dataSource={paymentMethods} />
      </div>
    </div>
  );
};

export default PaymentMethodTable;
