import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { format as dateFormat } from "date-fns";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { DatePicker, Table } from "antd";

import { fetchGetOrdersWithCriteria } from "../../services/OrderService";
import { fetchGetAllOrderStatuses } from "../../services/OrderStatusService";

const { RangePicker } = DatePicker;

const OrderTableAnt = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dates, setDates] = useState(null);

  const navigator = useNavigate();

  const getAllOrders = async () => {
    const today = new Date();
    const startDate = dateFormat(today, "yyyy-MM-dd").toString() + "T00:00:00";
    const endDate = dateFormat(today, "yyyy-MM-dd").toString() + "T23:59:59";
    console.log(startDate);
    console.log(endDate);

    let res;

    if (dates) {
      res = await fetchGetOrdersWithCriteria(dates.startDate, dates.endDate);
    } else {
      res = await fetchGetOrdersWithCriteria(startDate, endDate);
    }

    if (res && res.result) {
      const data = res.result.items.map((result, index) => ({
        ...result,
        key: index + 1,
      }));
      console.log("Data: ", data);
      setOrders(data);
    }
  };

  const getAllOrderStatuses = async () => {
    const res = await fetchGetAllOrderStatuses();

    if (res && res.result) {
      const orderStatuses = res.result;
      setOrderStatuses(
        orderStatuses.map((orderStatus) => ({
          text: orderStatus.name,
          value: orderStatus.id,
        }))
      );
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [dates]);

  useEffect(() => {
    getAllOrderStatuses();
  }, []);

  const columns = [
    {
      key: "1",
      title: "#",
      dataIndex: "key",
    },
    {
      key: "2",
      title: "Order Date",
      dataIndex: "createDate",
      width: 200,
      render: (createDate) => (
        <>{dateFormat(createDate, "dd/MM/yyyy, HH:mm:ss")}</>
      ),
      sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
    },
    {
      key: "3",
      title: "Total",
      dataIndex: "totalPrice",
      width: 120,
      render: (totalPrice) => (
        <NumericFormat
          value={totalPrice}
          displayType="text"
          thousandSeparator=","
          suffix=" đ"
        />
      ),
      sorter: (firstRecord, secondRecord) =>
        firstRecord.totalPrice - secondRecord.totalPrice,
    },
    {
      key: "4",
      title: "Order Status",
      dataIndex: "orderStatus",
      filters: orderStatuses,
      onFilter: (value, record) => {
        return record.orderStatus.id === value;
      },
      render: (orderStatus) => <>{orderStatus.name}</>,
    },
    {
      key: "5",
      title: "Payment Method",
      dataIndex: "paymentMethod",
      filters: [
        { text: "COD", value: 1 },
        { text: "VNPAY", value: 2 },
        { text: "MoMo", value: 3 },
      ],
      onFilter: (value, record) => {
        return record.paymentMethod.id === value;
      },
      render: (paymentMethod) => <>{paymentMethod.name}</>,
    },
    {
      key: "6",
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (paymentStatus) => <>{paymentStatus ? "Paid" : "Not paid yet"}</>,
      filters: [
        { text: "Paid", value: true },
        { text: "Not paid yet", value: false },
      ],
      onFilter: (value, record) => {
        return record.paymentStatus === value;
      },
    },
    {
      key: "6",
      title: "Actions",
      width: 100,
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => navigator(`/admin/edit-order/${record.id}`)}
              style={{ marginRight: 10 }}
            />
            <EyeOutlined
              onClick={() => navigator(`/admin/order-details/${record.id}`)}
            />
          </>
        );
      },
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
        <h2>Order Management</h2>
      </div>
      <div className="margin-bottom-10">
        <RangePicker
          format="DD-MM-YYYY"
          onChange={(dates) => {
            console.log("Date: ", dates);
            if (dates) {
              const startDate = dates[0].format("YYYY-MM-DDTHH:mm:ss");
              console.log("startDate: ", startDate);

              const endDate = dates[1].format("YYYY-MM-DDT23:59:59");
              console.log("endDate: ", endDate);

              setDates({ startDate, endDate });
            }
          }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          onChange: (pageNumber, pageSize) => {
            setPageNumber(pageNumber), setPageSize(pageSize);
          },
        }}
        scroll={{ x: true }}
      ></Table>
    </div>
  );
};

export default OrderTableAnt;
