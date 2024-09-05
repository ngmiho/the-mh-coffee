import React from "react";
import DateView from "react-datepicker";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError/TextError";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = (props) => {
  const { label, name, ...rest } = props;

  return (
    <div className={`form-group`}>
      <label htmlFor={name} className="control-label margin-right-15">
        {label}
      </label>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <>
              <br />
              <DateView
                type="date"
                className="form-control"
                id={name}
                {...field}
                {...rest}
                selected={value}
                onChange={(val) => setFieldValue(name, val)}
                dateFormat="Pp"
                showTimeSelect
              />
            </>
          );
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

export default DatePicker;
