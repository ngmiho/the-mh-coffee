import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  fetchGetToppingById,
  postCreateTopping,
  putUpdateTopping,
} from "../../services/ToppingService";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";

const ToppingForm = () => {
  const [formValues, setFormValues] = useState(null);

  const { id } = useParams();

  const navigator = useNavigate();

  useEffect(() => {
    if (id) {
      getToppingById(id);
    }
  }, [id]);

  const getToppingById = async (id) => {
    const res = await fetchGetToppingById(id);

    if (res && res.result) {
      const topping = res.result;
      setFormValues({ ...topping, isActive: topping.isActive.toString() });
    }
  };

  const initialValues = {
    name: "",
    price: "",
    isActive: "true",
  };

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);

    if (id) {
      handleUpdateTopping(id, values);
    } else {
      handleSaveTopping(values);
    }

    onSubmitProps.resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Required")
      .min(0, "Price must equal or greater than 0"),
    isActive: Yup.string().required("Required"),
  });

  const radioOptions = [
    { key: "Active", value: "true" },
    { key: "Inactive", value: "false" },
  ];

  const handleSaveTopping = async (data) => {
    const res = await postCreateTopping(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new topping successfull!");
      navigator("/admin/toppings");
    } else {
      toast.error("Error adding a new topping!");
    }
  };

  const handleUpdateTopping = async (id, data) => {
    const res = await putUpdateTopping(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update topping successfull!");
      navigator("/admin/toppings");
    } else {
      toast.error("Error updating a topping!");
    }
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Topping Form</h2>
        </div>
        <div className="panel-body">
          <Formik
            initialValues={formValues || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={false}
            enableReinitialize
          >
            {(formik) => (
              <Form className="templatemo-login-form">
                <FormikControl
                  control="input"
                  label="Topping name"
                  name="name"
                />

                <FormikControl
                  control="input"
                  label="Topping price"
                  name="price"
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

export default ToppingForm;
