import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [restoList, setRestoList] = useState([]);
  const [restoDetail, setRestoDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [openNow, setOpenNow] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      const allCategories = new Set();
      detailedRestaurants.forEach((resto) => {
        resto.categories.forEach((category) => allCategories.add(category.name));
      });
      setCategories([...allCategories]);
    };

    fetchRestoDetails();
  }, [restoList]);

  const findRestoItem = (restoId) => {
    return restoDetail.find((item) => item.id === restoId);
  };

  const handleFilterChange = () => {
    return restoDetail.filter((resto) => {
      const matchesCategory = selectedCategory ? resto.categories.some((cat) => cat.name === selectedCategory) : true;
      const matchesPrice = priceRange ? (resto.price !== undefined ? getPriceRange(resto.price) <= getPriceRange(priceRange) : true) : true;
      const matchesStatus = openNow ? resto.status === "Open" : true;
      return matchesCategory && matchesPrice && matchesStatus;
    });
  };

  const getPriceRange = (price) => {
    if (price === undefined) return 1;
    if (price <= 10) return 1;
    if (price <= 20) return 2;
    if (price <= 30) return 3;
    if (price > 30) return 4;
    return 0;
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
            <Form.Label>Price Range</Form.Label>
            <Form.Control as="select" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="">All</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-4">
        {filteredRestaurants.map((resto) => (
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
                <Card.Text>Price Range: {resto.price ? `$${resto.price}` : "N/A"}</Card.Text>
                <Card.Text>Status: {resto.status || "Closed"}</Card.Text>
                <Link to={`/detail/${resto.id}`}>
                  <Button variant="primary">Learn More</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
