import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetBankById,
  postCreateBank,
  putUpdateBank,
} from "../../services/BankService";

const BankForm = () => {
  const [formValues, setFormValues] = useState(null);

  const { id } = useParams();

  const navigator = useNavigate();

  const getBankById = async (id) => {
    const res = await fetchGetBankById(id);

    if (res && res.result) {
      setFormValues(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      getBankById(id);
    }
  }, [id]);

  const initialValues = {
    name: "",
  };

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);

    if (id) {
      handleUpdateBank(id, values);
    } else {
      handleSaveBank(values);
    }

    navigator("/admin/banks");

    onSubmitProps.resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSaveBank = async (data) => {
    const res = await postCreateBank(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new bank successfull!");
    } else {
      toast.error("Error adding a new bank!");
    }
  };

  const handleUpdateBank = async (id, data) => {
    const res = await putUpdateBank(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update bank successfull!");
    } else {
      toast.error("Error updating a bank!");
    }
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Bank Form</h2>
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
                  label="Bank name"
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

export default BankForm;
