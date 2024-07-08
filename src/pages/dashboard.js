import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css'; 

const Dashboard = () => {
  const [restoList, setRestoList] = useState([]);
  const [restoDetail, setRestoDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => { //fixed
    try {
      const response = await axios.get(`https://restaurant-api.dicoding.dev/list`);
      setRestoList(response.data.restaurants);
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantDetail = async (restoId) => { //fixed
    try {
      const response = await axios.get(`https://restaurant-api.dicoding.dev/detail/${restoId}`);
      return response.data.restaurant;
    } catch (error) {
      console.error("Error fetching restaurant detail:", error);
      return null;
    }
  };

  useEffect(() => { //ah dahlah
    const fetchRestoDetails = async () => {
      const detailedRestaurants = await Promise.all(
        restoList.map((resto) => fetchRestaurantDetail(resto.id))
      );
      setRestoDetail(detailedRestaurants);
      const allCategories = new Set();
      detailedRestaurants.forEach((resto) => {
        resto.categories.forEach((category) => allCategories.add(category.name));
      });
      setCategories([...allCategories]);
    };

    fetchRestoDetails();
  }, [restoList]);

  const findRestoItem = (restoId) => { //done
    return restoDetail.find((item) => item.id === restoId);
  };

  const handleFilterChange = () => { //done
    return restoDetail.filter((resto) => {
      const matchesCategory = selectedCategory ? resto.categories.some((cat) => cat.name === selectedCategory) : true;
      const matchesStatus = openNow ? resto.status === "Open" : true;
      const matchesPrice = priceRange ? getPriceRange(resto.id) <= priceRange : true;
      return matchesCategory && matchesPrice && matchesStatus;
    });
  };

  const getPriceRange = (restoId) => { //note : fix later after apex
    const resto = findRestoItem(restoId);
    if (!resto || resto.price === undefined || resto.price === 0) return "$(N/A)";
    if (resto.price <= 10) return "$";
    if (resto.price <= 20) return "$$";
    if (resto.price <= 30) return "$$$";
    return "$$$$";
  };

  const handlePriceRangeChange = (e) => {
    const range = parseInt(e.target.value);
    setPriceRange(range);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setOpenNow(false);
    setPriceRange("");
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const filteredRestaurants = handleFilterChange();

  return (
    <Container>
      <h1 className="mt-4">Restaurant</h1>
      <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <br></br>
      <Row className="mt-4">
        <Col md={3} className="d-flex align-items-center">
          <Form.Group>
            <Form.Check 
              type="checkbox"   
              label="Open Now" 
              checked={openNow} 
              onChange={(e) => setOpenNow(e.target.checked)} 
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Control className="custom-dropdown" as="select" value={priceRange} onChange={handlePriceRangeChange}>
              <option value="">Price Range</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Control className="custom-dropdown" as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-center justify-content-end">
          <Button variant="secondary" onClick={handleClearFilters}>Clear All</Button>
        </Col>
      </Row>
      <Row className="mt-4">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((resto) => (
            <Col md={3} className="mb-4" key={resto.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={
                    resto.pictureId
                      ? `https://restaurant-api.dicoding.dev/images/medium/${resto.pictureId}`
                      : "default-image.jpg"
                  }
                  alt={resto.name || "No name available"}
                  height="200"
                  width="270"
                />
                <Card.Body>
                  <Card.Title>{resto.name || "No name available"}</Card.Title>
                  <Card.Text>
                    Rating: 
                    <ReactStars
                      count={5}
                      value={resto.rating}
                      size={24}
                      activeColor="#ffd700"
                      isHalf={true}
                      edit={false}
                    />
                  </Card.Text>
                  {findRestoItem(resto.id) ? (
                    <>
                      <Card.Text>Categories:</Card.Text>
                      <Card.Text>
                        {findRestoItem(resto.id).categories.map((category, index) => (
                          <span key={index} className="badge bg-secondary me-1">{category.name}</span>
                        ))}
                      </Card.Text>
                    </>
                  ) : (
                    <Card.Text>No categories available</Card.Text>
                  )}
                  <Card.Text>Price Range: {getPriceRange(resto.id)}</Card.Text>
                  <Card.Text>Status: {resto.status || "Closed"}</Card.Text>
                  <Link to={`/detail/${resto.id}`}>
                    <Button variant="primary">Learn More</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col md={12}>
            <Alert variant="info">No restaurants match the selected criteria.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
