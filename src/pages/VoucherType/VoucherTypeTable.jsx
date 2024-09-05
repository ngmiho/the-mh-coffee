import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchAllVoucherTypes,
  deleteVoucherTypeById,
} from "../../services/VoucherTypeService";
import { Space, Table } from "antd";

const VoucherTypeTable = () => {
  const [voucherTypes, setVoucherTypes] = useState([]);

  const getAllVoucherTypes = async () => {
    const res = await fetchAllVoucherTypes();

    if (res && res.result) {
      const data = res.result.map((element, index) => ({
        ...element,
        key: index + 1,
      }));
      setVoucherTypes(data);
    }
  };

  useEffect(() => {
    getAllVoucherTypes();
  }, []);

  const navigator = useNavigate();

  const deleteVoucherType = async (id) => {
    const res = await deleteVoucherTypeById(id);

    if (res && res.message) {
      toast.success(res.message);
    } else {
      toast.error("Error deleting a voucher type!");
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
      render: (_, voucherType) => (
        <Space size="middle">
          <button
            className="templatemo-edit-btn"
            onClick={() =>
              navigator(`/admin/edit-voucher-type/${voucherType.id}`)
            }
          >
            Edit
          </button>
          <button
            className="templatemo-delete-btn"
            onClick={() => deleteVoucherType(voucherType.id)}
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
        <h2>Voucher Type Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/voucher-types/add")}
        >
          Add new category
        </button>
      </div>
      <div className="panel panel-default table-responsive">
        <Table columns={columns} dataSource={voucherTypes} />
      </div>
    </div>
  );
};

export default VoucherTypeTable;
