import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";

const Select = (props) => {
  const { label, name, options, ...rest } = props;
  return (
    <div className={`form-group`}>
      <label htmlFor={name} className="control-label">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        className="form-control"
        {...rest}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default Select;
