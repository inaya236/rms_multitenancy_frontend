import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import Base_URL from "../../config";

const RestaurantContext = createContext();

const themes = {
  orange_white: {
    primary: "#ff5722",
    secondary: "#ffffff",
  },
  olive_white: {
    primary: "#3D5A40",
    secondary: "#ffffff",
  },
  skyBlue_white: {
    primary: "#9cc6f7",
    secondary: "#ffffff",
  },
  gold_black: {
    primary: "#d4af37",
    secondary: "#111111",
  },
  maroon_white: {
    primary: "#721a17",
    secondary: "#fffdfd",
  }
};

export const RestaurantProvider = ({ children }) => {

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurant_id");
  const role = localStorage.getItem("role");

  useEffect(() => {

    if (role === "admin" && restaurantId) {

      axios.get(`${Base_URL}core/restaurants/${restaurantId}/`)
        .then(res => {

          const data = res.data;

          setRestaurant(data);
          console.log("restaurant data", data)

          const selectedTheme = themes[data.theme];

          if (selectedTheme) {

            document.documentElement.style.setProperty(
              "--primary-color",
              selectedTheme.primary
            );

            document.documentElement.style.setProperty(
              "--secondary-color",
              selectedTheme.secondary
            );

          }

          setLoading(false);

        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });

    } else {
      setLoading(false);
    }

  }, [restaurantId]);

  return (
    <RestaurantContext.Provider value={{ restaurant, loading }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);