import { Formik, Form, Field, setIn } from "formik";
import React, { useEffect, useState, useMemo } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetVoucherById,
  postCreateVoucher,
  putUpdateVoucher,
  fetchAllValidVouchers,
} from "../../services/VoucherService";
import { fetchAllVoucherTypes } from "../../services/VoucherTypeService";
import { uploadImageToCloudinary } from "../../services/upload-cloudinary";

const VoucherForm = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const [formValues, setFormValues] = useState(null);
  const [voucherTypes, setVoucherTypes] = useState([]);

  const [initialValues, setInitialValues] = useState({
    discountCode: "",
    amount: 0,
    beginDate: "",
    endDate: "",
    image: "",
    voucherTypeId: 1,
  });

  const validationSchema = Yup.object({
    discountCode: Yup.string().required("Required"),
    amount: Yup.number()
      .typeError("amount must be a number")
      .required("Required")
      .min(0, "Amount must equal or greater than 0"),
    beginDate: Yup.date().nullable(),
    endDate: Yup.date().nullable(),
    image: Yup.string().required("Required"),
    voucherTypeId: Yup.number().required("Required"),
  });

  const getVoucherById = async (id) => {
    const res = await fetchGetVoucherById(id);

    if (res && res.result) {
      const voucher = res.result;
      setFormValues({
        ...voucher,
        voucherTypeId: voucher.voucherType.id,
        beginDate: new Date(voucher.beginDate),
        endDate: new Date(voucher.endDate),
      });
    }
  };

  const getVoucherTypes = async () => {
    const res = await fetchAllVoucherTypes();

    if (res && res.result) {
      const VoucherTypesData = res.result;
      setVoucherTypes(
        VoucherTypesData.map((voucherType) => ({
          key: voucherType.name,
          value: voucherType.id,
        }))
      );
      setInitialValues({
        ...initialValues,
        voucherTypeId: VoucherTypesData[0].id,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getVoucherById(id);
    }
  }, [id]);

  useEffect(() => {
    getVoucherTypes();
  }, []);

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data: ", values);
    if (id) {
      const data = { voucherTypeId: values.voucherType.id, ...values };
      handleUpdateVoucher(id, data);
    } else {
      handleSaveVoucher(values);
    }

    navigator("/admin/vouchers");

    onSubmitProps.resetForm();
  };

  const handleSaveVoucher = async (data) => {
    const res = await postCreateVoucher(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new voucher successfull!");
    } else {
      toast.error("Error adding a new voucher!");
    }
  };

  const handleUpdateVoucher = async (id, data) => {
    const res = await putUpdateVoucher(id, data);
    if (res && res.result) {
      console.log(res.result);
      toast.success("Update voucher successfull!");
    } else {
      toast.error("Error updating a voucher!");
    }
  };

  const handleImageChange = async (e, formik) => {
    const { target } = e;
    const { files } = target;
    const image = await uploadImageToCloudinary(files[0]);
    formik.setFieldValue("image", image);
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Voucher Form</h2>
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
                  control="select"
                  label="Voucher Type"
                  name="voucherTypeId"
                  options={voucherTypes}
                />
                <FormikControl
                  control="input"
                  label="Discount Code"
                  name="discountCode"
                />
                <FormikControl control="input" label="Amount" name="amount" />
                <div className="row form-group">
                  <div className="col-md-3">
                    <FormikControl
                      control="date"
                      label="Begin Date"
                      name="beginDate"
                    />
                  </div>
                  <div className="col-md-3">
                    <FormikControl
                      control="date"
                      label="End Date"
                      name="endDate"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="image" className="control-label">
                      Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, formik)}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <img
                      src={formik.values.image}
                      className="img-thumbnail"
                      alt={formik.values.image}
                    />
                  </div>
                </div>
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

export default VoucherForm;
