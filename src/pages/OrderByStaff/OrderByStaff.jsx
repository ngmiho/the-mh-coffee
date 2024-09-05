import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Flex, Image, List, Select, Typography } from "antd";
import { NumericFormat } from "react-number-format";
import {
  fetchGetAllDrinks,
  fetchGetDrinksByCategoryId,
} from "../../services/DrinkService";
import { fetchAllCategories } from "../../services/CategoryService";
import DrawerDrinkDetail from "./DrawerDrinkDetail";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { postCreateOrder } from "../../services/OrderService";
import { useNavigate } from "react-router-dom";

const OrderByStaff = () => {
  const [drinks, setDrinks] = useState();

  const getAllDrinks = async () => {
    const res = await fetchGetAllDrinks();

    if (res && res.result) {
      setDrinks(res.result);
    }
  };

  useEffect(() => {
    getAllDrinks();
    getAllCategories();
  }, []);

  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    const res = await fetchAllCategories();

    if (res && res.result) {
      const categories = res.result.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      const options = [{ label: "Select Category", value: 0 }, ...categories];
      setCategories(options);
    }
  };

  const getDrinksByCategoryId = async (id) => {
    if (id === 0) {
      getAllDrinks();
    } else {
      const res = await fetchGetDrinksByCategoryId(id);

      if (res && res.result) {
        setDrinks(res.result);
      }
    }
  };

  const [isOpenDrawerDrinkDetail, setIsOpenDrawerDrinkDetail] = useState(false);
  const [drinkId, setDrinkId] = useState();

  const handleChooseDrink = (drinkId) => {
    setDrinkId(drinkId);
    setIsOpenDrawerDrinkDetail(true);
  };

  const handleCloseDrawerDrinkDetail = () => {
    setIsOpenDrawerDrinkDetail(false);
  };

  const { cart, updateItemQuantity, removeFromCart, getCartByUser } =
    useContext(StoreContext);

  const increaseItemQuantity = (id, quantity) => {
    const data = { id, quantity: quantity + 1 };
    updateItemQuantity(data);
  };

  const decreaseItemQuantity = (id, quantity) => {
    if (quantity === 1) {
      removeFromCart(id);
    } else {
      const data = { id, quantity: quantity - 1 };
      updateItemQuantity(data);
    }
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const navigator = useNavigate();

  const handleCreateOrder = async () => {
    const data = { paymentMethod: { id: 1 } };

    if (cart.cartItems.length > 0) {
      const res = await postCreateOrder(data);

      if (res && res.result) {
        toast.success(res.message);
        getCartByUser();
        navigator("/admin/table/orders");
      }
    } else {
      toast.info("Order is empty, please add some drink!");
    }
  };

  return (
    <>
      <div className="templatemo-content-widget white-bg">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Order Details</h2>
        </div>
        <div className="panel panel-default table-responsive">
          <table className="table table-striped table-bordered templatemo-user-table">
            <thead>
              <tr>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    # <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Drink Name <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Price <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Size <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Topping <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Quantity <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Total <span className="caret"></span>
                  </a>
                </td>
                <td>
                  <a href="" className="white-text templatemo-sort-by">
                    Remove <span className="caret"></span>
                  </a>
                </td>
              </tr>
            </thead>
            <tbody>
              {cart &&
                cart.cartItems &&
                cart.cartItems.map((cartItem, index) => (
                  <tr key={`cart-item-${index}`}>
                    <th>{index + 1}</th>
                    <td>{cartItem.drink.name}</td>
                    <td width={100}>
                      <NumericFormat
                        value={cartItem.price / cartItem.quantity}
                        displayType="text"
                        thousandSeparator=","
                        suffix=" đ"
                      />
                    </td>
                    <td>
                      <span>{cartItem.size && cartItem.size.character}</span>
                    </td>
                    <td style={{ maxWidth: 200 }}>
                      <Flex vertical>
                        {cartItem.toppings.length > 0 &&
                          cartItem.toppings.map((topping) => (
                            <span
                              key={`topping-${topping.id}`}
                              style={{ margin: 5 }}
                            >
                              {topping.name}
                            </span>
                          ))}
                      </Flex>
                    </td>
                    <td width={150}>
                      <Flex
                        justify="space-between"
                        align="center"
                        wrap={true}
                        gap="midle"
                      >
                        <button
                          className="templatemo-delete-btn"
                          style={{ margin: 0 }}
                          onClick={() =>
                            decreaseItemQuantity(cartItem.id, cartItem.quantity)
                          }
                        >
                          -
                        </button>
                        <span>{cartItem.quantity}</span>
                        <button
                          className="templatemo-edit-btn"
                          onClick={() =>
                            increaseItemQuantity(cartItem.id, cartItem.quantity)
                          }
                        >
                          +
                        </button>
                      </Flex>
                    </td>
                    <td width={100}>
                      <NumericFormat
                        value={cartItem.price}
                        displayType="text"
                        thousandSeparator=","
                        suffix=" đ"
                      />
                    </td>
                    <td>
                      <button
                        className="templatemo-delete-btn "
                        onClick={() => handleRemoveFromCart(cartItem.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="templatemo-flex-row flex-content-row">
          <div className="col-1"></div>
          <div className="col-1">
            <div className="panel panel-default margin-10">
              <div className="panel-heading">
                <h2 className="text-uppercase">Order Totals</h2>
              </div>
              {cart && (
                <div className="panel-body">
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td style={{ paddingLeft: 0 }}>Quantity</td>
                          <td style={{ paddingRight: 0, textAlign: "right" }}>
                            {cart.totalItems}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingLeft: 0 }}>Subtotal</td>
                          <td style={{ paddingRight: 0, textAlign: "right" }}>
                            <NumericFormat
                              value={cart.totalPrice}
                              displayType="text"
                              thousandSeparator=","
                              suffix=" đ"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th style={{ paddingLeft: 0 }}>Total</th>
                          <th style={{ paddingRight: 0, textAlign: "right" }}>
                            <NumericFormat
                              value={cart.totalPrice}
                              displayType="text"
                              thousandSeparator=","
                              suffix=" đ"
                            />
                          </th>
                        </tr>
                        <tr>
                          <td style={{ paddingLeft: 0 }}></td>
                          <td style={{ paddingRight: 0, textAlign: "right" }}>
                            <button
                              className="templatemo-blue-button"
                              onClick={() => handleCreateOrder()}
                            >
                              Place order
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="templatemo-content-widget white-bg">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Menu</h2>
        </div>

        {/* Menu */}
        <div>
          <Typography.Text>View by category: </Typography.Text>
          <Select
            style={{ width: 200 }}
            options={categories}
            defaultValue={"Select Category"}
            onChange={(value) => getDrinksByCategoryId(value)}
          ></Select>
        </div>
        <List
          grid={{ column: 4 }}
          renderItem={(drink, index) => {
            return (
              <Card
                title={drink.name}
                key={index}
                style={{ margin: 8 }}
                cover={<Image src={drink.images[0]}></Image>}
              >
                <Flex justify="space-between" align="center" wrap={true}>
                  <Typography.Title level={5} type="danger">
                    <NumericFormat
                      value={drink.price}
                      displayType="text"
                      thousandSeparator=","
                      suffix=" đ"
                    />
                  </Typography.Title>
                  <button
                    className="templatemo-blue-button"
                    onClick={() => handleChooseDrink(drink.id)}
                  >
                    Add
                  </button>
                </Flex>
              </Card>
            );
          }}
          dataSource={drinks}
        ></List>

        {/* Drawer Drink Detail */}
        <DrawerDrinkDetail
          open={isOpenDrawerDrinkDetail}
          onClose={handleCloseDrawerDrinkDetail}
          drinkId={drinkId}
        />
      </div>
    </>
  );
};

export default OrderByStaff;
