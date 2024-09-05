import React, { useEffect, useState } from "react";
import {
  deleteToppingById,
  fetchGetAllToppings,
} from "../../services/ToppingService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input, Space, Table } from "antd";
import {
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { NumericFormat } from "react-number-format";

const ToppingTable = () => {
  const [toppings, setToppings] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const getAllToppings = async () => {
    const res = await fetchGetAllToppings();

    if (res && res.result) {
      const data = res.result.map((result, index) => ({
        ...result,
        key: index + 1,
      }));

      setToppings(data);
      console.log("Toppings: ", data);
    }
  };

  useEffect(() => {
    getAllToppings();
  }, []);

  const navigator = useNavigate();

  const deleteTopping = async (id) => {
    const res = await deleteToppingById(id);

    if (res && res.message) {
      toast.success(res.message);
      getAllToppings();
    } else {
      toast.error("Error deleting a topping!");
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
      title: "Topping name",
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
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <NumericFormat
          value={price}
          displayType="text"
          thousandSeparator=","
          suffix=" đ"
        />
      ),
      sorter: (firstRecord, secondRecord) =>
        firstRecord.price - secondRecord.price,
    },
    {
      title: "Actions",
      width: 100,
      render: (record) => (
        <>
          <EditOutlined
            onClick={() => navigator(`/admin/edit-topping/${record.id}`)}
            style={{ marginRight: 10 }}
          />
          <DeleteOutlined
            style={{ color: "red" }}
            onClick={() => deleteTopping(record.id)}
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
        <h2>Topping Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/toppings/add")}
        >
          Add new topping
        </button>
      </div>
      <div className="panel panel-default table-responsive">
        <Table
          columns={columns}
          dataSource={toppings}
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

export default ToppingTable;
