import React, { useContext } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { StoreContext } from "../../context/StoreContext";
import { postLogin } from "../../services/AuthService";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken } = useContext(StoreContext);

  const navigator = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleLogin = async (data) => {
    const res = await postLogin(data);

    if (res && res.result) {
      const token = res.result.token;
      setToken(token);
      console.log("token: ", token);
      localStorage.setItem("token", token);
      navigator("/admin/dashboard");
    } else {
      const message = res.response.data.message;
      toast.error(message);
    }
  };

  const onSubmit = (values) => {
    console.log("Form values: ", values);
    handleLogin(values);
  };

  return (
    <div
      className="templatemo-content-widget no-padding"
      style={{ width: "50%", margin: "auto" }}
    >
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Login</h2>
        </div>
        <div className="panel-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            enableReinitialize
          >
            {(formik) => (
              <Form className="templatemo-login-form">
                <FormikControl control="input" label="Email" name="email" />
                <FormikControl
                  control="input"
                  type="password"
                  label="Password"
                  name="password"
                />

                <div className="form-group">
                  <button
                    type="submit"
                    className="templatemo-blue-button margin-right-15"
                  >
                    Login
                  </button>
                  <button
                    type="reset"
                    className="templatemo-white-button margin-right-15"
                  >
                    Cancel
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

export default Login;
