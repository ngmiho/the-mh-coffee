import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { format as dateFormat } from "date-fns";
import { fetchGetUserById, putUpdateUser } from "../../services/UserService";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import { fetchGetAllRoles } from "../../services/RoleService";

const UserForm = () => {
  const [formValues, setFormValues] = useState();
  const [roles, setRoles] = useState([]);

  const { id } = useParams();

  const navigator = useNavigate();

  const getUserById = async (id) => {
    const res = await fetchGetUserById(id);

    if (res && res.result) {
      const user = res.result;
      let dob = user.dob;
      if (dob) dob = dateFormat(dob, "dd/MM/yyyy");
      setFormValues({
        ...user,
        isActive: user.isActive.toString(),
        roles: user.roles.map((role) => role.name),
        dob: dob,
      });
    }
  };

  useEffect(() => {
    if (id) getUserById(id);
  }, [id]);

  const getAllRoles = async () => {
    const res = await fetchGetAllRoles();

    if (res && res.result) {
      const roles = res.result;
      setRoles(roles.map((role) => ({ key: role.name, value: role.name })));
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  const radioOptions = [
    { key: "Active", value: "true" },
    { key: "Inactive", value: "false" },
  ];

  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    isActive: "true",
    authType: "",
    dob: "",
    roles: [],
  };

  const onSubmit = (values) => {
    console.log("Form values: ", values);
    const data = {
      isActive: values.isActive,
      roles: values.roles,
    };

    console.log("Data: ", data);

    if (id) {
      handleUpdateUser(id, data);
    }
  };

  const handleUpdateUser = async (id, data) => {
    const res = await putUpdateUser(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success(res.message);
      navigator("/admin/table/users");
    } else {
      toast.error("Error updating user!");
    }
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">User Form</h2>
        </div>
        <div className="panel-body">
          <Formik
            initialValues={formValues || initialValues}
            onSubmit={onSubmit}
            validateOnChange={false}
            enableReinitialize
          >
            {(formik) => (
              <Form className="templatemo-login-form">
                <div className="row form-group">
                  <div className="col-md-6">
                    <FormikControl
                      control="input"
                      label="Email"
                      name="email"
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <FormikControl
                      control="input"
                      label="Phone Number"
                      name="phoneNumber"
                      readOnly
                    />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-md-6">
                    <FormikControl
                      control="input"
                      label="First Name"
                      name="firstName"
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <FormikControl
                      control="input"
                      label="Last Name"
                      name="lastName"
                      readOnly
                    />
                  </div>
                </div>

                <FormikControl
                  control="input"
                  label="Auth Type"
                  name="authType"
                  readOnly
                />

                <FormikControl
                  control="input"
                  label="Birthday"
                  name="dob"
                  readOnly
                />

                <FormikControl
                  control="checkbox"
                  label="Role"
                  name="roles"
                  options={roles}
                />

                <FormikControl
                  control="radio"
                  label="Active"
                  name="isActive"
                  options={radioOptions}
                />

                <div className="form-group">
                  <button
                    type="submit"
                    className="templatemo-blue-button margin-right-15"
                  >
                    Save
                  </button>
                  <button
                    type="reset"
                    className="templatemo-white-button margin-right-15"
                  >
                    Reset
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
