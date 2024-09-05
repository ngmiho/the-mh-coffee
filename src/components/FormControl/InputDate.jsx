import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";
import { format } from "date-fns"

const Input = (props) => {
  const { label, name, ...rest } = props;

  return (
    <div className={`form-group`}>
      <label htmlFor={name} className="control-label">
        {label}
      </label>
      <Field
        type="date"
        id={name}
        name={name}
        className="form-control"
        value={format(new Date(name), "dd/MM/yyyy")}
        {...rest}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default Input;
