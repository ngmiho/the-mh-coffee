import { Formik, Form, Field } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetPaymentMethodBankById,
  postCreatePaymentMethodBank,
  putUpdatePaymentMethodBank,
} from "../../services/PaymentMethodBankService";
import { fetchAllPaymentMethods } from "../../services/PaymentMethodService";
import { fetchAllBanks } from "../../services/BankService";

const PaymentMethodBankForm = () => {
  const [formValues, setFormValues] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [banks, setBanks] = useState([]);

  const { id } = useParams();

  const navigator = useNavigate();

  const getPaymentMethodBankById = async (id) => {
    const res = await fetchGetPaymentMethodBankById(id);

    if (res && res.result) {
      const paymentMethodBank = res.result;
      setFormValues({
        ...paymentMethodBank,
        paymentMethodId: paymentMethodBank.paymentMethod.id,
        bankId: paymentMethodBank.bank.id,
      });
    }
  };

  const getPaymentMethods = async () => {
    const res = await fetchAllPaymentMethods();

    if (res && res.result) {
      setPaymentMethods(res.result);
    }
  };

  const getBanks = async () => {
    const res = await fetchAllBanks();

    if (res && res.result) {
      setBanks(res.result);
    }
  };

  useEffect(() => {
    if (id) {
      getPaymentMethodBankById(id);
    }
  }, [id]);

  useEffect(() => {
    getPaymentMethods();
    getBanks();
  }, []);

  const initialValues = {
    owner: "",
    creditCard: "",
    totalPrice: 0,
    date: "",
    paymentMethodId: 1,
    bankId: "",
  };

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);

    if (id) {
      handleUpdatePaymentMethodBank(id, values);
    } else {
      handleSavePaymentMethodBank(values);
    }

    navigator("/admin/payment-method-banks");

    onSubmitProps.resetForm();
  };

  const validationSchema = Yup.object({
    owner: Yup.string().required("Required"),
    creditCard: Yup.string().required("Required"),
    totalPrice: Yup.number()
      .required("Required")
      .min(0, "Price must equal or greater than 0"),
    date: Yup.string().required("Required"),
    paymentMethodId: Yup.number().required("Required"),
    bankId: Yup.number().required("Required"),
  });

  const handleSavePaymentMethodBank = async (data) => {
    const res = await postCreateCategory(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new payment method bank successfull!");
    } else {
      toast.error("Error adding a new payment method bank!");
    }
  };

  const handleUpdatePaymentMethodBank = async (id, data) => {
    const res = await putUpdateCategory(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update payment method bank successfull!");
    } else {
      toast.error("Error updating a payment method bank!");
    }
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Payment Method Bank Form</h2>
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
                <FormikControl control="input" label="Owner" name="owner" />
                <FormikControl
                  control="input"
                  label="Credit Card"
                  name="creditCard"
                  disab
                />
                <FormikControl
                  control="input"
                  label="Total Price"
                  name="totalPrice"
                />
                <div className={`form-group`}>
                  <label htmlFor="paymentMethodId" className="control-label">
                    Payment Method
                  </label>
                  <Field
                    as="select"
                    id="paymentMethodId"
                    name="paymentMethodId"
                    className="form-control"
                  >
                    {paymentMethods.map((paymentMethod) => {
                      return (
                        <option key={paymentMethod.id} value={paymentMethod.id}>
                          {paymentMethod.name}
                        </option>
                      );
                    })}
                  </Field>
                </div>
                <div className={`form-group`}>
                  <label htmlFor="bankId" className="control-label">
                    Bank
                  </label>
                  <Field
                    as="select"
                    id="bankId"
                    name="bankId"
                    className="form-control"
                  >
                    {banks.map((bank) => {
                      return (
                        <option key={bank.id} value={bank.id}>
                          {bank.name}
                        </option>
                      );
                    })}
                  </Field>
                </div>
                <div className="form-group">
                  <button
                    className="templatemo-white-button margin-right-15"
                    onClick={() => navigator(`/admin/payment-method-banks`)}
                  >
                    Back
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

export default PaymentMethodBankForm;
