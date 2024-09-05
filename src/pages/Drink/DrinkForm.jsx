import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import FormikControl from "../../components/FormControl/FormikControl";
import { toast } from "react-toastify";
import {
  fetchGetDrinkById,
  postCreateDrink,
  putUpdateDrink,
} from "../../services/DrinkService";
import { uploadImageToCloudinary } from "../../services/upload-cloudinary";
import { fetchAllCategories } from "../../services/CategoryService";
import { fetchGetAllToppings } from "../../services/ToppingService";
import TextError from "../../components/TextError/TextError";
import { fetchGetAllSizes } from "../../services/SizeService";

const DrinkForm = () => {
  const [formValues, setFormValues] = useState(null);
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [sizes, setSizes] = useState([]);

  const { id } = useParams();

  const navigator = useNavigate();

  console.log("Sizes: ", sizes);

  useEffect(() => {
    if (id) {
      getDrinkById(id);
    }
  }, [id]);

  const getDrinkById = async (id) => {
    const res = await fetchGetDrinkById(id);

    if (res && res.result) {
      const drink = res.result;
      setFormValues({
        ...drink,
        categoryId: drink.category.id,
        isActive: drink.isActive.toString(),
        toppings: drink.toppings.map((topping) => topping.id.toString()),
      });
    }
  };

  const getAllCategories = async () => {
    const res = await fetchAllCategories();

    if (res && res.result) {
      setCategories(res.result);
    }
  };

  const getAllToppings = async () => {
    const res = await fetchGetAllToppings();

    if (res && res.result) {
      const toppings = res.result;
      setToppings(
        toppings.map((topping) => ({ key: topping.name, value: topping.id }))
      );
    }
  };

  const getAllSizes = async () => {
    const res = await fetchGetAllSizes();
    if (res && res.result) {
      const sizes = res.result;

      setSizes(
        sizes.map((size) => ({
          size,
          price: "",
        }))
      );
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllToppings();
    getAllSizes();
  }, []);

  const initialValues = {
    name: "",
    description: "",
    price: "",
    categoryId: 1,
    isActive: "true",
    images: [],
    toppings: [],
    drinkSizes: sizes,
  };

  const radioOptions = [
    { key: "Active", value: "true" },
    { key: "Inactive", value: "false" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Required")
      .min(0, "Price must equal or greater than 0"),
    isActive: Yup.string().required("Required"),
    drinkSizes: Yup.array().of(
      Yup.object().shape({
        price: Yup.number()
          .typeError("Price must be a number")
          .required("Required")
          .min(0, "Price must equal or greater than 0"),
      })
    ),
  });

  const onSubmit = (values, onSubmitProps) => {
    const data = {
      ...values,
      categoryId: parseInt(values.categoryId),
      toppings: values.toppings.map((topping) => ({ id: parseInt(topping) })),
    };
    console.log("Form data: ", data);

    if (id) {
      handleUpdateDrink(id, data);
    } else {
      handleSaveDrink(data);
    }

    onSubmitProps.resetForm();
  };

  const handleSaveDrink = async (data) => {
    const res = await postCreateDrink(data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Add a new drink successfully!");
      navigator("/admin/table/drinks");
    } else {
      toast.error("Error adding a new drink!");
    }
  };

  const handleUpdateDrink = async (id, data) => {
    const res = await putUpdateDrink(id, data);

    if (res && res.result) {
      console.log(res.result);
      toast.success("Update drink successfully!");
      navigator("/admin/table/drinks");
    } else {
      toast.error("Error updating a drink!");
    }
  };

  const handleImageChange = async (e, formik) => {
    console.log("Event: ", e);
    console.log("Formik: ", formik);

    const file = e.target.files[0];

    const image = await uploadImageToCloudinary(file);

    formik.setFieldValue("images", [...formik.values.images, image]);
  };

  const handleRemoveImage = (index, formik) => {
    console.log("Index: ", index);
    console.log("Formik: ", formik);

    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="templatemo-content-widget no-padding">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="text-uppercase">Drink Form</h2>
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
                <FormikControl control="input" label="Drink name" name="name" />

                <FormikControl
                  control="input"
                  label="Drink price"
                  name="price"
                />

                <div className={`form-group`}>
                  <label htmlFor="categoryId" className="control-label">
                    Category
                  </label>
                  <Field
                    as="select"
                    id="categoryId"
                    name="categoryId"
                    className="form-control"
                  >
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage name="categoryId" component={TextError} />
                </div>

                <FormikControl
                  control="radio"
                  label="Active"
                  name="isActive"
                  options={radioOptions}
                />

                <FormikControl
                  control="checkbox"
                  label="Topping"
                  name="toppings"
                  options={toppings}
                />

                <div className="form-group">
                  <label htmlFor="drinkSizes">Drink size</label>

                  <FieldArray name="drinkSizes">
                    {(fieldArrayProps) => {
                      console.log("Field Array Props: ", fieldArrayProps);
                      const { push, remove, form } = fieldArrayProps;

                      const { values } = form;
                      const { drinkSizes } = values;

                      return (
                        <div>
                          <button
                            type="button"
                            className="templatemo-edit-btn margin-bottom-10"
                            style={{ height: "100%" }}
                            onClick={() => push(sizes[0])}
                            disabled={drinkSizes.length > 0}
                          >
                            Add size
                          </button>
                          {drinkSizes.map((drinkSize, index) => (
                            <div key={index} className="margin-bottom-10 ">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Field
                                  type="text"
                                  name={`drinkSizes[${index}].price`}
                                  className="form-control margin-right-15 margin-bottom-5"
                                  placeholder={`Size ${drinkSize.size.character}`}
                                />
                                <button
                                  type="button"
                                  className="templatemo-edit-btn"
                                  style={{ height: "100%" }}
                                  onClick={() => push(sizes[index + 1])}
                                  disabled={
                                    index === sizes.length - 1 ||
                                    (drinkSizes.length > 1 && index === 0)
                                  }
                                >
                                  Add
                                </button>
                                <button
                                  type="button"
                                  className="templatemo-edit-btn"
                                  style={{ height: "100%" }}
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </button>
                              </div>
                              <ErrorMessage
                                name={`drinkSizes[${index}].price`}
                                component={TextError}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  </FieldArray>
                </div>

                <FormikControl
                  control="textarea"
                  label="Description"
                  name="description"
                />

                <div className="form-group">
                  <label htmlFor="images">Upload Images</label>
                  <input
                    type="file"
                    id="images"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, formik)}
                  />
                  <div className="templatemo-flex-row">
                    {formik.values.images.map((image, index) => (
                      <img
                        style={{ width: 100, marginRight: 10, marginTop: 10 }}
                        key={index}
                        src={image}
                        alt="Upload image preview"
                        onDoubleClick={() => handleRemoveImage(index, formik)}
                      />
                    ))}
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

export default DrinkForm;
