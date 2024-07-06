import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [restoList, setRestoList] = useState([]);
  const [restoDetail, setRestoDetail] = useState([]);

  useEffect(() => {
    localStorage.setItem("restoDetail", JSON.stringify(restoDetail));
  }, [restoDetail]);

  useEffect(() => {
    const storedrestoDetail = localStorage.getItem("restoDetail");
    if (storedrestoDetail) {
      setRestoDetail(JSON.parse(storedrestoDetail));
    }
  }, []);

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
                  src={resto.pictureId ? `https://restaurant-api.dicoding.dev/images/medium/${resto.pictureId}` : 'default-image.jpg'}
                  className="img"
                  alt={resto.name || 'No name available'}
                  height="200"
                />
                <h2 className="card-title">{resto.name || 'No name available'}</h2>
                <h6 className="card-text">{resto.description || 'No description available'}</h6>
                <h5 className="card-text">{resto.city || 'No city available'}</h5>
                <h5 className="card-text">{resto.rating || 'No rating available'}</h5>
                <h6 className="card-text">
                  {resto.categories ? resto.categories.map(category => category.name).join(', ') : 'No categories available'}
                </h6>
                <h6 className="card-text">{resto.priceRange || 'No price range available'}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
