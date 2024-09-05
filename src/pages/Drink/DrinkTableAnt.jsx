import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EditOutlined, SearchOutlined, LockOutlined } from "@ant-design/icons";

import {
  deleteDrinkById,
  fetchGetAllDrinks,
  putUpdateDrinkStatus,
} from "../../services/DrinkService";
import { Button, Flex, Image, Input, Space, Table } from "antd";
import { NumericFormat } from "react-number-format";
import { fetchAllCategories } from "../../services/CategoryService";

const DrinkTableAnt = () => {
  const [drinks, setDrinks] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [categories, setCategories] = useState([]);

  const getAllDrinks = async () => {
    const res = await fetchGetAllDrinks();

    if (res && res.result) {
      const data = res.result.map((result, index) => ({
        ...result,
        key: index + 1,
      }));
      console.log("Drink data: ", data);
      setDrinks(data);
    }
  };

  useEffect(() => {
    getAllDrinks();
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    const res = await fetchAllCategories();

    if (res && res.result) {
      const categories = res.result;
      setCategories(
        categories.map((category) => ({
          text: category.name,
          value: category.id,
        }))
      );
    }
  };

  const handleUpdateDrinkStatus = async (id) => {
    const res = await putUpdateDrinkStatus(id);

    if (res && res.result) {
      toast.success(res.message);
      getAllDrinks();
    } else {
      toast.error("Error updating drink status");
    }
  };

  const navigator = useNavigate();

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

  const deleteDrink = async (id) => {
    const res = await deleteDrinkById(id);

    if (res && res.message) {
      toast.success(res.message);
      getAllDrinks();
    } else {
      toast.error("Error deleting drink");
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      sorter: (drink1, drink2) => {
        return drink1.key > drink2.key;
      },
    },
    {
      title: "Drink Name",
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
      title: "Category",
      dataIndex: "category",
      render: (category) => <>{category.name}</>,
      filters: categories,
      onFilter: (value, record) => {
        return record.category.id === value;
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive) => <p>{isActive ? "Active" : "Inactive"}</p>,
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => {
        return record.isActive === value;
      },
    },
    {
      title: "Image",
      dataIndex: "images",
      render: (images) => {
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "space-between",
            }}
          >
            {images.length > 0 &&
              images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt="Drink image preview"
                  style={{ width: 50, margin: 5 }}
                />
              ))}
          </div>
        );
      },
    },

    {
      title: "Actions",
      render: (record) => {
        return (
          <Flex justify="center">
            <EditOutlined
              style={{ marginRight: 10 }}
              onClick={() => navigator(`/admin/edit-drink/${record.id}`)}
            />
            <LockOutlined
              style={{ color: "red" }}
              onClick={() => handleUpdateDrinkStatus(record.id)}
            />
          </Flex>
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
        <h2>Drink Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/drinks/add")}
        >
          Add new drink
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={drinks}
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          onChange: (pageNumber, pageSize) => {
            setPageNumber(pageNumber), setPageSize(pageSize);
          },
        }}
      ></Table>
    </div>
  );
};

export default DrinkTableAnt;
