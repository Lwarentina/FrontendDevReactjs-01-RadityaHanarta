import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [restoList, setRestoList] = useState([]);
  const [restoDetail, setRestoDetail] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://restaurant-api.dicoding.dev/list`);
      setRestoList(response.data.restaurants);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchRestaurantDetail = async (restoId) => {
    try {
      const response = await axios.get(`https://restaurant-api.dicoding.dev/detail/${restoId}`);
      return response.data.restaurant;
    } catch (error) {
      console.error("Error fetching restaurant detail:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRestoDetails = async () => {
      const detailedRestaurants = await Promise.all(
        restoList.map((resto) => fetchRestaurantDetail(resto.id))
      );
      setRestoDetail(detailedRestaurants);
    };

    fetchRestoDetails();
  }, [restoList]);

  const findRestoItem = (restoId) => {
    return restoDetail.find((item) => item.id === restoId);
  };

  return (
    <div className="container">
      <h1>Restaurant</h1>
      <br />
      <div className="row">
        {restoList.map((resto) => (
          <div className="col-md-3 mb-3" key={resto.id}>
            <div className="card">
              <div className="card-body">
                <img
                  src={
                    resto.pictureId
                      ? `https://restaurant-api.dicoding.dev/images/medium/${resto.pictureId}`
                      : "default-image.jpg"
                  }
                  className="img"
                  alt={resto.name || "No name available"}
                  height="200"
                  width="270"
                />
                <h2 className="card-title">{resto.name || "No name available"}</h2>
                <h6 className="card-text">{resto.description || "No description available"}</h6>
                <h5 className="card-text">{resto.city || "No city available"}</h5>
                <h5 className="card-text">{resto.rating || "No rating available"}</h5>
                {findRestoItem(resto.id) ? (
                  <div>
                    <h6 className="card-text">Categories:</h6>
                    {findRestoItem(resto.id).categories.map((category, index) => (
                      <p key={index}>{category.name}</p>
                    ))}
                  </div>
                ) : (
                  <p>No categories available</p>
                )}
                <h6 className="card-text">{resto.priceRange || "No price range available"}</h6>
                <Link to={`/detail/${resto.id}`} className="btn btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
