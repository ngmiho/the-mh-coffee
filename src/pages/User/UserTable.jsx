import React, { useEffect, useState } from "react";
import { fetchGetAllUsers } from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const navigator = useNavigate();

  const getAllUsers = async () => {
    const res = await fetchGetAllUsers();

    if (res && res.result) {
      setUsers(res.result);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

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
      <div className="panel panel-default table-responsive">
        <table className="table table-striped table-bordered templatemo-user-table">
          <thead>
            <tr>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  # <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Email <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  First Name <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Last Name <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Phone Number <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Active <span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Role <span className="caret"></span>
                </a>
              </td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.length > 0 &&
              users.map((user, index) => (
                <tr key={`user-${index}`}>
                  <th>{index + 1}</th>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    {user.roles.map((role) => (
                      <span
                        style={{ marginRight: 5 }}
                        key={`role-${role.name}`}
                      >
                        {role.name}
                      </span>
                    ))}
                  </td>
                  <td style={{ minWidth: 180 }}>
                    <button
                      className="templatemo-edit-btn"
                      onClick={() => navigator(`/admin/edit-user/${user.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="templatemo-delete-btn"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
