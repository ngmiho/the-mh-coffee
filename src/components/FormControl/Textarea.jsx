import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";

const Textarea = (props) => {
  const { label, name, ...rest } = props;

  return (
    <div className={`form-group`}>
      <label htmlFor={name} className="control-label">
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        className="form-control"
        {...rest}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default Textarea;
