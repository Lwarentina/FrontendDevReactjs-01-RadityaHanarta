import React, { useState, useEffect } from "react";
import axios from "axios";

const Detail = ({ match }) => {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurantDetail();
  }, []);

  const fetchRestaurantDetail = async () => {
    try {
      const response = await axios.get(`https://restaurant-api.dicoding.dev/detail/${match.params.id}`);
      setRestaurant(response.data.restaurant);
    } catch (error) {
      console.error("Error fetching restaurant detail:", error);
    }
  };

  if (!restaurant) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className="container">
      <h1>{restaurant.name}</h1>
      <div>
        <img
          src={`https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`}
          alt={restaurant.name}
          height="200"
          width="270"
        />
      </div>
      <p>{restaurant.description}</p>
      <p>City: {restaurant.city}</p>
      <p>Address: {restaurant.address}</p>
      <p>Rating: {restaurant.rating}</p>
      <h3>Categories:</h3>
      <ul>
        {restaurant.categories.map((category, index) => (
          <li key={index}>{category.name}</li>
        ))}
      </ul>
      <h3>Menus:</h3>
      <div>
        <h4>Foods:</h4>
        <ul>
          {restaurant.menus.foods.map((food, index) => (
            <li key={index}>{food.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Drinks:</h4>
        <ul>
          {restaurant.menus.drinks.map((drink, index) => (
            <li key={index}>{drink.name}</li>
          ))}
        </ul>
      </div>
      <h3>Customer Reviews:</h3>
      <ul>
        {restaurant.customerReviews.map((review, index) => (
          <li key={index}>
            <p>{review.name} - {review.date}</p>
            <p>{review.review}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Detail;
