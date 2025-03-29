# Popcorn Palace Project - Instructions

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Setting Up the Project](#setting-up-the-project)
4. [Running the Project](#running-the-project)
5. [Building the Project](#building-the-project)
6. [Testing the Project](#testing-the-project)
7. [Additional Notes](#additional-notes)

---

## 1. Project Overview

Popcorn Palace is a movie ticket booking system that allows users to book tickets for showtimes, manage movie details, and check for seat availability. This project includes an API built with **NestJS**, a PostgreSQL database, and extensive functionality such as managing movies, showtimes, and ticket bookings.

### Features:
- Create, manage, and delete movies.
- Manage movie showtimes.
- Book tickets for available seats.
- Prevent booking of already reserved seats.
- Automated tests to ensure correctness.

---

## 2. Prerequisites

Before you start, ensure you have the following tools installed on your machine:

1. **Node.js** - Make sure you have Node.js version 14 or higher.
   - Download from: [https://nodejs.org/](https://nodejs.org/)

2. **Docker** - Required to run PostgreSQL locally.
   - Download from: [https://www.docker.com/get-started](https://www.docker.com/get-started)

3. **pgAdmin** - Used for visualizing and managing the PostgreSQL database.
   - Download from: [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/)

---

## 3. Setting Up the Project

1. **Clone the Repository**:
   If you haven't already, clone the project from your GitHub repository:
   ```bash
   git clone https://github.com/your-username/popcorn-palace.git
   cd popcorn-palace
   ```

2. **Install Dependencies**: 
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Set Up PostgreSQL Database**: 
   The project uses PostgreSQL to store movie and ticket data. To set up the database, you can use Docker:

   - Make sure Docker Desktop is installed and running.

   - In the project folder, create a docker-compose.yml file with the following content:
     ```yaml
     version: "3.8"
     services:
       postgres:
         image: postgres:13
         container_name: popcorn_palace_postgres
         environment:
           POSTGRES_USER: postgres
           POSTGRES_PASSWORD: popcorn_palace
           POSTGRES_DB: popcorn_palace
         ports:
           - "5432:5432"
         volumes:
           - ./data:/var/lib/postgresql/data
         networks:
           - popcorn_palace_network
     networks:
       popcorn_palace_network:
         driver: bridge
     ```

   - Run the following command to start the PostgreSQL container:
     ```bash
     docker-compose up
     ```

---

## 4. Database Setup

The database schema is not automatically created by `docker-compose`, so you need to manually create the necessary tables in your PostgreSQL database. Below are the SQL commands you can use to create the required tables.

### SQL to Create Tables

Run the following SQL queries in your PostgreSQL database to create the necessary tables for the **Popcorn Palace** system.

```sql
-- Movies Table
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    duration INT,
    rating FLOAT,
    releaseYear INT
);

-- Showtimes Table
CREATE TABLE showtimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movieId UUID REFERENCES movies(id) ON DELETE CASCADE,
    startTime TIMESTAMP NOT NULL,
    CONSTRAINT unique_showtime UNIQUE (movieId, startTime)  -- Ensures no overlapping showtimes for the same movie
);

-- Tickets Table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showtimeId UUID REFERENCES showtimes(id) ON DELETE CASCADE,
    seatNumber INT NOT NULL,
    userId VARCHAR(100) NOT NULL,
    isBooked BOOLEAN DEFAULT FALSE,
    bookingId UUID DEFAULT gen_random_uuid(),
    CONSTRAINT unique_seat UNIQUE (showtimeId, seatNumber),  -- Ensures no double booking for the same seat in a showtime
    CONSTRAINT valid_booking CHECK (isBooked = TRUE AND seatNumber IS NOT NULL)  -- Ensures a valid booking with a seat number
);


## 5. Running the Project

**Run the Application**: 
Once the dependencies are installed, and PostgreSQL is set up, run the application in development mode:

```bash
npm run start
```

This will start the server on http://localhost:3000 (default). You can access the API endpoints here.

---

## 6. Building the Project

To build the project for production, run the following command:

```bash
npm run build
```

This will create a dist/ directory containing the compiled application. To start the production version:

```bash
npm run start:prod
```

---

## 7. Testing the Project

The project is equipped with unit and end-to-end tests to verify that all functionality works as expected.

### Run End-to-End (E2E) Tests:
To run the E2E tests that test the entire application flow:

```bash
npm run test:e2e
```

This will start the app, make requests to the endpoints, and verify that the expected behavior occurs (e.g., booking tickets, creating showtimes, etc.).

This command will show the test coverage report for the project.

---

## 8. Additional Notes

- **Error Handling**: Proper error handling has been implemented using BadRequestException for cases like booking the same seat twice.
