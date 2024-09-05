import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetVoucherTypeById,
  postCreateVoucherType,
  putUpdateVoucherType,
} from "../../services/VoucherTypeService";

const VoucherTypeForm = () => {
  const [formValues, setFormValues] = useState(null);

  const { id } = useParams();

  const navigator = useNavigate();

  const getVoucherTypeById = async (id) => {
    const res = await fetchGetVoucherTypeById(id);

    if (res && res.result) {
      setFormValues(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      getVoucherTypeById(id);
    }
  }, [id]);

  const initialValues = {
    name: "",
  };

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);

    if (id) {
      handleUpdateVoucherType(id, values);
    } else {
      handleSaveVoucherType(values);
    }

    navigator("/admin/voucher-types");

    onSubmitProps.resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSaveVoucherType = async (data) => {
    const res = await postCreateVoucherType(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new voucher type successfull!");
    } else {
      toast.error("Error adding a new voucher type!");
    }
  };

  const handleUpdateVoucherType = async (id, data) => {
    const res = await putUpdateVoucherType(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update voucher type successfull!");
    } else {
      toast.error("Error updating a category!");
    }
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Voucher Type Form</h2>
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
                  label="Voucher type name"
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

export default VoucherTypeForm;
