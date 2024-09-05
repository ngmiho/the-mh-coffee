import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormControl/FormikControl";

const FormikContainer = () => {
  const dropdownOptions = [
    { key: "Select an option", value: "" },
    { key: "Option 1", value: "otion1" },
    { key: "Option 2", value: "otion2" },
    { key: "Option 3", value: "otion3" },
    { key: "Option 4", value: "otion4" },
  ];

  const radioOptions = [
    { key: "Active", value: "true" },
    { key: "Inactive", value: "false" },
  ];

  const checkboxOptions = [
    { key: "Option 1", value: "cOtion1" },
    { key: "Option 2", value: "cOtion2" },
    { key: "Option 3", value: "cOtion3" },
  ];

  const initialValues = {
    email: "",
    price: "",
    description: "",
    selectOption: "",
    radioOption: "",
    checkboxOption: [],
    birthDate: null,
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Required")
      .min(0, "Price must equal or greater than 0"),
    description: Yup.string().required("Required"),
    selectOption: Yup.string().required("Required"),
    radioOption: Yup.string().required("Required"),
    checkboxOption: Yup.array().required("Required"),
    birthDate: Yup.date().required("Required").nullable(),
  });
  const onSubmit = (values) => {
    console.log("Form data: ", values);
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="templatemo-login-form">
          <FormikControl
            control="input"
            type="email"
            label="Email"
            name="email"
          />
          <FormikControl
            control="input"
            type="text"
            label="Price"
            name="price"
          />
          <FormikControl
            control="textarea"
            label="Description"
            name="description"
          />
          <FormikControl
            control="select"
            label="Select a topic"
            name="selectOption"
            options={dropdownOptions}
          />
          <FormikControl
            control="radio"
            label="Radio topic"
            name="radioOption"
            options={radioOptions}
          />
          <FormikControl
            control="checkbox"
            label="Checkbox topic"
            name="checkboxOption"
            options={checkboxOptions}
          />
          <FormikControl control="date" label="Birth date" name="birthDate" />
          <button
            type="submit"
            className="templatemo-blue-button margin-right-15"
          >
            Save
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormikContainer;
