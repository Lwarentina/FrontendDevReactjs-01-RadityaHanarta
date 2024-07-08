import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom"
import { Container, Row, Col, Card, ListGroup, Button, } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Detail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurantDetail();
  }, []);

  const fetchRestaurantDetail = async () => {
    try {
      const response = await axios.get(`https://restaurant-api.dicoding.dev/detail/${id}`);
      setRestaurant(response.data.restaurant);
    } catch (error) {
      console.error("Error fetching restaurant detail:", error);
    }
  };

  if (!restaurant) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <Container className="mt-4">
      <Row>
        <Link to={`/`}>
          <Button variant="primary">Back</Button>
        </Link>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Img variant="top" src={`https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`} alt={restaurant.name} />
            <Card.Body>
              <Card.Title>{restaurant.name}</Card.Title>
              <Card.Text>{restaurant.description}</Card.Text>
              <Card.Text><strong>City:</strong> {restaurant.city}</Card.Text>
              <Card.Text><strong>Address:</strong> {restaurant.address}</Card.Text>
              <div className="mb-3">
                <h4>Rating:</h4>
                <ReactStars
                  count={5}
                  value={restaurant.rating}
                  size={24}
                  activeColor="#ffd700"
                  isHalf={true}
                  edit={false}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Menus</Card.Title>
              <h4>Foods</h4>
              <ListGroup variant="flush">
                {restaurant.menus.foods.map((food, index) => (
                  <ListGroup.Item key={index}>
                    {food.name} - ${food.price || "0"}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <h4 className="mt-3">Drinks</h4>
              <ListGroup variant="flush">
                {restaurant.menus.drinks.map((drink, index) => (
                  <ListGroup.Item key={index}>
                    {drink.name} - ${drink.price || "0"}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Categories</Card.Title>
                <ListGroup variant="flush">
                  {restaurant.categories.map((category, index) => (
                    <ListGroup.Item key={index}>{category.name}</ListGroup.Item>
                  ))}
                </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Customer Reviews</Card.Title>
              <ListGroup variant="flush">
                {restaurant.customerReviews.map((review, index) => (
                  <ListGroup.Item key={index}>
                    <p><strong>{review.name}</strong> - {review.date}</p>
                    <p>{review.review}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Detail;
