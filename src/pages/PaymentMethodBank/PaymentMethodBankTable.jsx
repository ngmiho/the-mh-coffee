import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllPaymentMethodBanks } from "../../services/PaymentMethodBankService";
import { format as dateFormat } from "date-fns";
import { NumericFormat } from "react-number-format";

import { Space, Table } from "antd";

const PaymentMethodBankTable = () => {
  const [paymentMethodBanks, setPaymentMethodBanks] = useState([]);

  const getAllPaymentMethodBanks = async () => {
    const res = await fetchAllPaymentMethodBanks();

    if (res && res.result) {
      const data = res.result.map((element, index) => ({
        ...element,
        key: index + 1,
      }));
      setPaymentMethodBanks(data);
    }
  };

  useEffect(() => {
    getAllPaymentMethodBanks();
  }, []);

  const navigator = useNavigate();

  const deletePaymentMethodBank = async (id) => {
    const res = await deletePaymentMethodBankById(id);

    if (res && res.message) {
      toast.success(res.message);
    } else {
      toast.error("Error deleting a payment method bank!");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Transaction No",
      dataIndex: "transactionNo",
      key: "transactionNo",
    },
    {
      title: "Total Price",
      dataIndex: "amount",
      key: "amount",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ["descend"],
      render: (amount) => (
        <NumericFormat
          value={amount}
          displayType="text"
          thousandSeparator=","
          suffix=" đ"
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "payDate",
      key: "payDate",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.payDate - b.payDate,
      sortDirections: ["descend"],
      render: (payDate) => (
        <>{dateFormat(new Date(payDate), "dd/MM/yyyy, HH:mm:ss")}</>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      defaultSortOrder: "descend",
      render: (paymentMethod) => (
        <td className="ant-table-cell ant-table-column-sort">
          {paymentMethod.name}
        </td>
      ),
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      defaultSortOrder: "descend",
      render: (bank) => (
        <td className="ant-table-cell ant-table-column-sort">{bank.name}</td>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (_, paymentMethodBank) => (
        <Space size="middle">
          <button
            className="templatemo-edit-btn"
            onClick={() =>
              navigator(
                `/admin/edit-payment-method-bank/${paymentMethodBank.id}`
              )
            }
          >
            Detail
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
        <h2>Payment Method Bank Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/payment-method-banks/add")}
        >
          Add new payment method bank
        </button>
      </div>
      <div className="panel panel-default table-responsive">
        <Table columns={columns} dataSource={paymentMethodBanks} />
      </div>
    </div>
  );
};

export default PaymentMethodBankTable;
