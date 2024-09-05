import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetPaymentMethodById,
  postCreatePaymentMethod,
  putUpdatePaymentMethod,
} from "../../services/PaymentMethodService";

const PaymentMethodForm = () => {
  const [formValues, setFormValues] = useState(null);

  const { id } = useParams();

  const navigator = useNavigate();

  const getPaymentMethodById = async (id) => {
    const res = await fetchGetPaymentMethodById(id);

    if (res && res.result) {
      setFormValues(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      getPaymentMethodById(id);
    }
  }, [id]);

  const initialValues = {
    name: "",
  };

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);

    if (id) {
      handleUpdatePaymentMethod(id, values);
    } else {
      handleSavePaymentMethod(values);
    }

    navigator("/admin/payment-methods");

    onSubmitProps.resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSavePaymentMethod = async (data) => {
    const res = await postCreatePaymentMethod(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new category successfull!");
    } else {
      toast.error("Error adding a new category!");
    }
  };

  const handleUpdatePaymentMethod = async (id, data) => {
    const res = await putUpdatePaymentMethod(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update category successfull!");
    } else {
      toast.error("Error updating a category!");
    }
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Payment Method Form</h2>
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
                  label="Payment method name"
                  name="name"
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

export default PaymentMethodForm;
