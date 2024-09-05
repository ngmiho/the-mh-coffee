import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllReview } from "../../services/ReviewService";
import { Space, Table } from "antd";

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);

  const getAllReviews = async () => {
    const res = await fetchAllReview();
    if (res && res.result) {
      const data = res.result;
      const reverseData = data.reverse().map((element, index) => ({
        ...element,
        key: index + 1,
      }));
      setReviews(reverseData);
    }
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  const navigator = useNavigate();

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Order Id",
      dataIndex: "order",
      key: "order",
      render: (order) => (
        <td className="ant-table-cell ant-table-column-sort">{order.id}</td>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <td className="ant-table-cell ant-table-column-sort">
          {rating > 0 ? rating : "-"}
        </td>
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
        <h2>Review Management</h2>
      </div>
      <div className="panel panel-default table-responsive">
        <Table columns={columns} dataSource={reviews} />
      </div>
    </div>
  );
};

export default ReviewTable;
