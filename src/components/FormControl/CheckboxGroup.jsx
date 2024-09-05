import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";

const CheckboxGroup = (props) => {
  const { label, name, options, ...rest } = props;
  return (
    <div className={`form-group`}>
      <label htmlFor={name} className="control-label templatemo-block">
        {label}
      </label>
      <Field name={name} {...rest}>
        {({ field }) => {
          return options.map((option) => {
            return (
              <div
                className="margin-right-15 templatemo-inline-block"
                key={option.key}
              >
                <input
                  type="checkbox"
                  id={`${name}-${option.value}`}
                  {...field}
                  value={option.value}
                  checked={field.value.includes(option.value.toString())}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="font-weight-400"
                >
                  <span></span>
                  {option.key}
                </label>
              </div>
            );
          });
        }}
      </Field>
      <br />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default CheckboxGroup;
