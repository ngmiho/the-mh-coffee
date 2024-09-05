import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetSizeById,
  postCreateSize,
  putUpdateSize,
} from "../../services/SizeService";

const SizeForm = () => {
  const [formValues, setFormValues] = useState(null);

  const { id } = useParams();

  const navigator = useNavigate();

  const getSizeById = async (id) => {
    const res = await fetchGetSizeById(id);

    if (res && res.result) {
      setFormValues(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      getSizeById(id);
    }
  }, [id]);

  const initialValues = {
    name: "",
    character: "",
  };

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);

    if (id) {
      handleUpdateSize(id, values);
    } else {
      handleSaveSize(values);
    }

    onSubmitProps.resetForm();
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    character: Yup.string().required("Required"),
  });

  const handleSaveSize = async (data) => {
    const res = await postCreateSize(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new size successfull!");
      navigator("/admin/sizes");
    } else {
      toast.error("Error adding a new size!");
    }
  };

  const handleUpdateSize = async (id, data) => {
    const res = await putUpdateSize(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update size successfull!");
      navigator("/admin/sizes");
    } else {
      toast.error("Error updating a size!");
    }
  };
  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Size Form</h2>
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
                <FormikControl control="input" label="Size name" name="name" />

                <FormikControl
                  control="input"
                  label="Character"
                  name="character"
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

export default SizeForm;
