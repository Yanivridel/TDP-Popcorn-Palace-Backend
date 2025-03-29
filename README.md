# Popcorn Palace - API Endpoints Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Movies Endpoints](#movies-endpoints)
4. [Showtimes Endpoints](#showtimes-endpoints)
5. [Tickets Endpoints](#tickets-endpoints)
6. [Error Handling](#error-handling)
7. [Example Requests](#example-requests)

---

## 1. Overview

Popcorn Palace is a movie ticket booking system built with **NestJS** and **PostgreSQL**. Below is a list of all available API endpoints, along with their descriptions and expected inputs.

---

## 2. Authentication

Currently, there are no authentication mechanisms in place for this project. All requests can be made without authentication.

---

## 3. Movies Endpoints

### Create a Movie

**POST** `/movies`

This endpoint is used to create a new movie entry.

#### Request Body:
```json
{
  "title": "Movie Title",
  "genre": "Movie Genre",
  "duration": 120,
  "rating": 8.5,
  "releaseYear": 2023
}
```

#### Response:
```json
{
  "id": "movie-id",
  "title": "Movie Title",
  "genre": "Movie Genre",
  "duration": 120,
  "rating": 8.5,
  "releaseYear": 2023
}
```

### Get All Movies

**GET** `/movies`

This endpoint retrieves all the movies available in the system.

#### Response:
```json
[
  {
    "id": "movie-id",
    "title": "Movie Title",
    "genre": "Movie Genre",
    "duration": 120,
    "rating": 8.5,
    "releaseYear": 2023
  }
]
```

### Get a Movie by ID

**GET** `/movies/:id`

This endpoint retrieves a specific movie based on the provided movie ID.

#### URL Params:
- id (string) - The ID of the movie.

#### Response:
```json
{
  "id": "movie-id",
  "title": "Movie Title",
  "genre": "Movie Genre",
  "duration": 120,
  "rating": 8.5,
  "releaseYear": 2023
}
```

### Delete a Movie

**DELETE** `/movies/:id`

This endpoint deletes a movie based on the provided movie ID.

#### URL Params:
- id (string) - The ID of the movie to delete.

#### Response:
```json
{
  "message": "Movie with ID movie-id successfully deleted"
}
```

---

## 4. Showtimes Endpoints

### Create a Showtime

**POST** `/showtimes`

This endpoint is used to create a new showtime for a movie.

#### Request Body:
```json
{
  "movieId": "movie-id",
  "startTime": "2025-04-01T14:00:00.000Z"
}
```

#### Response:
```json
{
  "id": "showtime-id",
  "movieId": "movie-id",
  "startTime": "2025-04-01T14:00:00.000Z"
}
```

### Get All Showtimes

**GET** `/showtimes`

This endpoint retrieves all the showtimes available in the system.

#### Response:
```json
[
  {
    "id": "showtime-id",
    "movieId": "movie-id",
    "startTime": "2025-04-01T14:00:00.000Z"
  }
]
```

### Get Showtimes by Movie ID

**GET** `/showtimes/movie/:movieId`

This endpoint retrieves all the showtimes for a specific movie.

#### URL Params:
- movieId (string) - The ID of the movie.

#### Response:
```json
[
  {
    "id": "showtime-id",
    "movieId": "movie-id",
    "startTime": "2025-04-01T14:00:00.000Z"
  }
]
```

### Delete a Showtime

**DELETE** `/showtimes/:id`

This endpoint deletes a showtime based on the provided showtime ID.

#### URL Params:
- id (string) - The ID of the showtime to delete.

#### Response:
```json
{
  "message": "Showtime with ID showtime-id successfully deleted"
}
```

---

## 5. Tickets Endpoints

### Book a Ticket

**POST** `/bookings`

This endpoint is used to book a ticket for a specific showtime and seat.

#### Request Body:
```json
{
  "showtimeId": "showtime-id",
  "seatNumber": 10,
  "userId": "user-id"
}
```

#### Response:
```json
{
  "bookingId": "booking-id"
}
```

### Get All Booked Tickets for a Showtime

**GET** `/bookings/showtime/:showtimeId`

This endpoint retrieves all booked tickets for a specific showtime.

#### URL Params:
- showtimeId (string) - The ID of the showtime.

#### Response:
```json
[
  {
    "bookingId": "booking-id",
    "seatNumber": 10,
    "userId": "user-id",
    "isBooked": true
  }
]
```

---

## 6. Error Handling

The API returns appropriate error messages for different invalid or failed requests.

### Common Error Responses:

#### BadRequestException 
Occurs when a seat is already booked or when the provided data is invalid.

```json
{
  "statusCode": 400,
  "message": "Seat 10 is already booked for this showtime."
}
```

#### NotFoundException 
Occurs when a movie, showtime, or ticket cannot be found.

```json
{
  "statusCode": 404,
  "message": "Movie with ID movie-id not found"
}
```

#### Internal Server Error 
Occurs for any unexpected server-side error.

```json
{
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## 7. Example Requests

Here are some example curl commands for interacting with the API:

### Create a Movie
```bash
curl -X POST http://localhost:3000/movies \
     -H "Content-Type: application/json" \
     -d '{"title": "Test Movie", "genre": "Action", "duration": 120, "rating": 7.5, "releaseYear": 2023}'
```

### Book a Ticket
```bash
curl -X POST http://localhost:3000/bookings \
     -H "Content-Type: application/json" \
     -d '{"showtimeId": "showtime-id", "seatNumber": 10, "userId": "user-id"}'
```