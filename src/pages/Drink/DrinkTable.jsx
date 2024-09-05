import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  deleteDrinkById,
  fetchGetAllDrinks,
} from "../../services/DrinkService";

const DrinkTable = () => {
  const [drinks, setDrinks] = useState([]);

  const getAllDrinks = async () => {
    const res = await fetchGetAllDrinks();

    if (res && res.result) {
      setDrinks(res.result);
      console.log("Drink result: ", res.result);
    }
  };

  useEffect(() => {
    getAllDrinks();
  }, []);

  const navigator = useNavigate();

  const deleteDrink = async (id) => {
    const res = await deleteDrinkById(id);

    if (res && res.message) {
      toast.success(res.message);
      getAllDrinks();
    } else {
      toast.error("Error deleting drink");
    }
  };

  return (
    <div className="templatemo-content-widget white-bg">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>Drink Management</h2>
        <button
          className="templatemo-blue-button"
          onClick={() => navigator("/admin/drinks/add")}
        >
          Add new drink
        </button>
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
                  Category<span className="caret"></span>
                </a>
              </td>
              <td>
                <a href="" className="white-text templatemo-sort-by">
                  Images <span className="caret"></span>
                </a>
              </td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {drinks &&
              drinks.length > 0 &&
              drinks.map((drink, index) => (
                <tr key={`drink-${index}`}>
                  <th>{index + 1}</th>
                  <td>{drink.name}</td>
                  <td>{drink.price}</td>
                  <td>{drink.category.name}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignContent: "space-between",
                      }}
                    >
                      {drink.images.length > 0 &&
                        drink.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt="Drink image preview"
                            style={{ width: 50, margin: 5 }}
                          />
                        ))}
                    </div>
                  </td>
                  <td style={{ minWidth: 180 }}>
                    <button
                      className="templatemo-edit-btn"
                      onClick={() => navigator(`/admin/edit-drink/${drink.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="templatemo-delete-btn"
                      onClick={() => deleteDrink(drink.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrinkTable;
