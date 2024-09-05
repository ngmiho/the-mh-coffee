import React, { useEffect, useState } from "react";
import { fetchGetAllUsers, putLockUser } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { Button, Input, Space, Table } from "antd";
import { EditOutlined, LockOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const UserTableAnt = () => {
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const navigator = useNavigate();

  const getAllUsers = async () => {
    const res = await fetchGetAllUsers();

    if (res && res.result) {
      const data = res.result.map((result, index) => ({
        ...result,
        key: index + 1,
      }));
      console.log("Data: ", data);
      setUsers(data);
    }
  };

  const handleLockUser = async (id) => {
    const res = await putLockUser(id);

    if (res && res.result) {
      console.log(res.result);
      toast.success(res.message);
      getAllUsers();
    } else {
      toast.error("Error lock user!");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

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
      title: "Email",
      dataIndex: "email",
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
        return record.email.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (firstRecord, secondRecord) =>
        firstRecord.firstName.localeCompare(secondRecord.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (firstRecord, secondRecord) =>
        firstRecord.lastName.localeCompare(secondRecord.lastName),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
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
        return record.phoneNumber.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Active",
      dataIndex: "isActive",
      render: (isActive) => <>{isActive ? "Active" : "Inactive"}</>,
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => {
        return record.isActive === value;
      },
    },
    {
      title: "Role",
      dataIndex: "roles",
      render: (roles) => (
        <>
          {roles.map((role) => (
            <span style={{ marginRight: 5 }} key={`role-${role.name}`}>
              {role.name}
            </span>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      width: 100,
      render: (record) => (
        <>
          <EditOutlined
            onClick={() => navigator(`/admin/edit-user/${record.id}`)}
            style={{ marginRight: 10 }}
          />
          <LockOutlined
            style={{ color: "red" }}
            onClick={() => handleLockUser(record.id)}
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
        <h2>User Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/users/add")}
        >
          Add new user
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        scroll={{ x: true }}
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

export default UserTableAnt;
