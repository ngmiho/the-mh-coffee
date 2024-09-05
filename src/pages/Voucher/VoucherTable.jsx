import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchAllVouchers,
  deleteVoucherById,
} from "../../services/VoucherService";
import { fetchGetVoucherTypeById } from "../../services/VoucherTypeService";
import { Space, Table } from "antd";
import { NumericFormat } from "react-number-format";
import { format as dateFormat } from "date-fns";

const VoucherTable = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    getAllVouchers();
  }, []);

  const getAllVouchers = async () => {
    const res = await fetchAllVouchers();
    if (res && res.result) {
      const data = res.result;
      const reverseData = data.reverse().map((element, index) => ({
        ...element,
        key: index + 1,
      }));
      setVouchers(data);
    }
  };

  const handleVoucherTypeName = async (id) => {
    const res = await fetchGetVoucherTypeById(id);
    if (res && res.result) {
      const name = res.result.name;
      return name;
    }
  };

  const navigator = useNavigate();

  const deleteVoucher = async (id) => {
    const res = await deleteVoucherById(id);

    if (res && res.message) {
      toast.success(res.message);
    } else {
      toast.error("Error deleting a voucher!");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Voucher Type",
      dataIndex: "voucherType",
      key: "voucherType",
      sorter: (a, b) => a.voucherType.name.length - b.voucherType.name.length,
      sortDirections: ["descend"],
      render: (voucherType) => (
        <td className="ant-table-cell ant-table-column-sort">
          {voucherType.name}
        </td>
      ),
    },
    {
      title: "Discount Code",
      dataIndex: "discountCode",
      key: "discountCode",
      sorter: (a, b) => a.discountCode.length - b.discountCode.length,
      sortDirections: ["descend"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ["descend"],
      render: (amount) => (
        <>
          {amount > 1 ? (
            <NumericFormat
              value={amount}
              displayType="text"
              thousandSeparator=","
              suffix=" đ"
            />
          ) : (
            amount + "%"
          )}
        </>
      ),
    },
    {
      title: "Begin Date",
      dataIndex: "beginDate",
      key: "beginDate",
      sortDirections: ["descend"],
      sorter: (a, b) => a.beginDate.length - b.beginDate.length,
      render: (beginDate) => (
        <>{dateFormat(beginDate, "dd/MM/yyyy, HH:mm:ss")}</>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sortDirections: ["descend"],
      sorter: (a, b) => a.endDate.length - b.endDate.length,
      render: (endDate) => <>{dateFormat(endDate, "dd/MM/yyyy, HH:mm:ss")}</>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      sortDirections: ["descend"],
      render: (image) => (
        <>
          <td className="ant-table-cell ant-table-column-sort">
            <img
              src={image}
              alt="Voucher image preview"
              style={{ width: 150, margin: 5 }}
            />
          </td>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (_, voucher) => (
        <Space size="middle">
          <button
            className="templatemo-edit-btn"
            onClick={() => navigator(`/admin/edit-voucher/${voucher.id}`)}
          >
            Edit
          </button>
          <button
            className="templatemo-delete-btn"
            onClick={() => deleteVoucher(voucher.id)}
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
        <h2>Voucher Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/vouchers/add")}
        >
          Add new voucher
        </button>
      </div>
      <div className="panel panel-default table-responsive">
        <Table columns={columns} dataSource={vouchers} />
      </div>
    </div>
  );
};

export default VoucherTable;
