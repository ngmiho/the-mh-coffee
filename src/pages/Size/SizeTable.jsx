import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteSizeById, fetchGetAllSizes } from "../../services/SizeService";
import { Button, Input, Space, Table } from "antd";
import {
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const SizeTable = () => {
  const [sizes, setSizes] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const getAllSizes = async () => {
    const res = await fetchGetAllSizes();

    if (res && res.result) {
      const data = res.result.map((result, index) => ({
        ...result,
        key: index + 1,
      }));

      setSizes(data);
      console.log("Sizes: ", data);
    }
  };

  useEffect(() => {
    getAllSizes();
  }, []);

  const navigator = useNavigate();

  const deleteSize = async (id) => {
    const res = await deleteSizeById(id);

    if (res && res.message) {
      toast.success(res.message);
      getAllSizes();
    } else {
      toast.error("Error deleting a size!");
    }
  };

  const handleFilterDropdown = (
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  ) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          style={{ marginBottom: 8 }}
          autoFocus
          placeholder="Type text here"
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => {
            confirm();
          }}
          onBlur={() => {
            confirm();
          }}
        ></Input>
        <Space>
          <Button
            onClick={() => {
              confirm();
            }}
            type="primary"
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    );
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
    },
    {
      title: "Size name",
      dataIndex: "name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) =>
        handleFilterDropdown(
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters
        ),
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Character",
      dataIndex: "character",
    },
    {
      title: "Actions",
      width: 100,
      render: (record) => (
        <>
          <EditOutlined
            onClick={() => navigator(`/admin/edit-size/${record.id}`)}
            style={{ marginRight: 10 }}
          />
          <DeleteOutlined
            style={{ color: "red" }}
            onClick={() => deleteSize(record.id)}
          />
        </>
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
        <h2>Size Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/sizes/add")}
        >
          Add new size
        </button>
      </div>
      <div className="panel panel-default table-responsive">
        <Table
          columns={columns}
          dataSource={sizes}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            onChange: (pageNumber, pageSize) => {
              setPageNumber(pageNumber), setPageSize(pageSize);
            },
          }}
        ></Table>
      </div>
    </div>
  );
};

export default SizeTable;
