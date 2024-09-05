import React, { useContext, useEffect, useState } from "react";
import { Button, Checkbox, Drawer, Flex, Image, Radio, Typography } from "antd";
import { fetchGetDrinkById } from "../../services/DrinkService";
import { NumericFormat } from "react-number-format";
import { Field, Form, Formik } from "formik";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const DrawerDrinkDetail = (props) => {
  const { open, onClose, drinkId } = props;

  const [drink, setDrink] = useState({});
  const [drinkPrice, setDrinkPrice] = useState(0);
  const [toppingPrice, seTtoppingPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState();
  const [quantity, setQuantity] = useState(1);
  const [initialValues, setInitialValues] = useState({
    drinkId: "",
    sizeId: "",
    toppings: [],
    price: "",
  });

  const { addToCart } = useContext(StoreContext);

  console.log("Drink id: ", drinkId);

  useEffect(() => {
    if (drinkId) {
      getDrinkById(drinkId);
    }
  }, [drinkId]);

  useEffect(() => {
    if (toppingPrice > 0) setTotalPrice((drinkPrice + toppingPrice) * quantity);
    else setTotalPrice(drinkPrice * quantity);

    console.log("Topping price: ", toppingPrice);
    console.log("Drink price: ", drinkPrice);
  }, [drinkPrice, toppingPrice, quantity]);

  const getDrinkById = async (id) => {
    const res = await fetchGetDrinkById(id);

    if (res && res.result) {
      const drinkRes = res.result;
      console.log("Drink res: ", drinkRes);

      setDrink(drinkRes);

      setTotalPrice(drinkRes.price);
      seTtoppingPrice(0);
      setDrinkPrice(drinkRes.price);
      setQuantity(1);

      setInitialValues({
        drinkId: drinkId,
        sizeId: "",
        toppings: [],
        price: "",
      });
    }
  };

  const onSubmit = (values) => {
    console.log("Form values: ", values);
    const cartItem = {
      ...values,
      drinkId: drinkId,
      price: totalPrice,
      quantity: quantity,
    };
    console.log("Cart item: ", cartItem);
    addToCart(cartItem);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      toast.error("Quantity must be greater than 0");
    }
  };

  return (
    <>
      <Drawer title={drink.name} onClose={onClose} open={open} width={500}>
        {drink && (
          <>
            <Typography.Title type="danger" level={3}>
              <NumericFormat
                value={totalPrice}
                displayType="text"
                thousandSeparator=","
                suffix=" đ"
              />
            </Typography.Title>
            <div>
              <Typography.Title level={4}>Quantity</Typography.Title>
              <Flex flex="start" align="center" wrap={true} gap="middle">
                <button
                  className="templatemo-delete-btn"
                  style={{ margin: 0 }}
                  onClick={() => handleDecreaseQuantity()}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="templatemo-edit-btn"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </Flex>
            </div>
            <div>
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validateOnChange={false}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    {drink.drinkSizes && drink.drinkSizes.length > 0 && (
                      <div>
                        <Typography.Title level={4}>Size</Typography.Title>
                        <Field name="sizeId">
                          {({ field }) => {
                            return drink.drinkSizes.map((drinkSize, index) => (
                              <span
                                key={`drinkSize-${index}`}
                                className="margin-right-15 templatemo-inline-block"
                              >
                                <input
                                  type="radio"
                                  className="btn-check"
                                  {...field}
                                  value={drinkSize.size.id}
                                  id={`drinkSize-${drinkSize.size.id}`}
                                  checked={
                                    field.value === drinkSize.size.id.toString()
                                  }
                                  onClick={() => {
                                    setDrinkPrice(drinkSize.price);
                                  }}
                                />
                                <label
                                  className="font-weight-400"
                                  htmlFor={`drinkSize-${drinkSize.size.id}`}
                                >
                                  <span></span>
                                  {drinkSize.size.name} +{" "}
                                  {drinkSize.price - drink.price} đ
                                </label>
                              </span>
                            ));
                          }}
                        </Field>
                      </div>
                    )}

                    {drink.toppings && drink.toppings.length > 0 && (
                      <div>
                        <Typography.Title level={4}>Topping</Typography.Title>
                        <Field name="toppings">
                          {({ field }) => {
                            return drink.toppings.map((topping, index) => (
                              <div
                                key={`topping-${index}`}
                                className="margin-right-15 templatemo-inline-block"
                              >
                                <input
                                  type="checkbox"
                                  {...field}
                                  value={topping.id}
                                  id={`topping-${topping.id}`}
                                  checked={field.value.includes(
                                    topping.id.toString()
                                  )}
                                  onClick={(e) => {
                                    e.target.checked
                                      ? seTtoppingPrice(
                                          (prev) => prev + topping.price
                                        )
                                      : seTtoppingPrice(
                                          (prev) => prev - topping.price
                                        );
                                  }}
                                />
                                <label
                                  className="font-weight-400"
                                  htmlFor={`topping-${topping.id}`}
                                >
                                  <span></span>
                                  {topping.name} + {topping.price} đ
                                </label>
                              </div>
                            ));
                          }}
                        </Field>
                      </div>
                    )}
                    <hr></hr>
                    <button
                      type="submit"
                      className="templatemo-blue-button margin-right-15"
                    >
                      Add to cart
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
};

export default DrawerDrinkDetail;
