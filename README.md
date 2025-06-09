# GameHaven REST API

## Executive Summary

GameHaven is a fictional digital video game marketplace. This project implements the backend REST API for this platform using Node.js, Express.js, and MongoDB. It provides functionalities for user management, game catalog Browse and management (admin only), shopping cart operations, and order placement.

## Project Objectives

* Build a RESTful API using Node.js and Express.js.
* Integrate with MongoDB using Mongoose.
* Implement user authentication and authorization using JWT.
* Enable shopping cart, order management, and game catalog features.
* Apply backend development best practices, including MVC pattern (Controllers, Models, Routes), Service Layer abstraction, Middleware, and Validation.
* Simulate a production-grade API with error handling and environment configurations.

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcrypt
* Multer
* express-validator
* morgan
* dotenv

## Project Setup

### Prerequisites

* [Node.js](https://nodejs.org/) installed on your machine.
* [npm](https://www.npmjs.com/) (Node Package Manager) installed (comes with Node.js).
* [MongoDB](https://www.mongodb.com/) instance running (either locally or a cloud-based service like MongoDB Atlas).

### Installation

1.  Clone the repository to your local machine:
    ```bash
    git clone [https://github.com/amr-ibrahim7/gamehaven-api-G3-.git](https://github.com/amr-ibrahim7/gamehaven-api-G3-.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd gamehaven-api-G3-
    ```
3.  Install the project dependencies:
    ```bash
    npm install
    ```

### Environment Variables
**
Create a `.env` file in the root directory of the project based on the provided `.env.example` file. You will need to configure the following environment variables:**


**MongoDB Config**

* DB_USER=your_db_username
* DB_PASS=your_db_password
* DB_CLUSTER=your_cluster_name
* DB_NAME=your_database_name

**JWT Config**

* JWT_SECRET=your_jwt_secret_key

**PORT**

* PORT=your_preferred_port (e.g., 3001)



**Replace the placeholder values with your actual MongoDB credentials, JWT secret key, and desired port number.**

### Running the Application

**To start the development server, run the following command:**

```bash
npm start
    ```
    
    
    ## API Endpoints

The API follows a RESTful architecture. Here are the main endpoints:

### User Authentication

* **POST /api/users/register**: Registers a new user.
    * **Request Body:**
        ```json
        {
            "name": "user name",
            "email": "user@example.com",
            "password": "password"
        }
        ```
    * **Response:** Returns user information (excluding password) and a success message.
* **POST /api/users/login**: Logs in an existing user.
    * **Request Body:**
        ```json
        {
            "email": "user@example.com",
            "password": "password"
        }
        ```
    * **Response:** Returns user information (excluding password) and a JWT token.
* **GET /api/users/profile**: Retrieves the authenticated user's profile information.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Response:** Returns the user's profile details (excluding password).
* **GET /api/users/orders**: Retrieves the order history for the authenticated user.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Response:** Returns an array of the user's past orders.
* **PUT /api/users/admin/profile/:id**: Allows an admin user to update a specific user's profile.
    * **Headers:** Requires a valid JWT token with admin role in the `Authorization` header (Bearer token).
    * **Path Parameter:** `id`: The ID of the user to update.
    * **Request Body:**
        ```json
        {
            "name": "new user name",
            "email": "user.new.email@example.com",
            "role": "admin"
        }
        ```
    * **Response:** Returns a message indicating successful update and the updated user information.

### Game Catalog

* **GET /api/games**: Retrieves a list of games with pagination and optional filtering.
    * **Query Parameters:**
        * `page`: The page number to retrieve (default: 1).
        * `limit`: The number of games per page (default: 10).
        * `genre`: Filter games by genre (case-insensitive).
        * `platform`: Filter games by platform (case-insensitive).
        * `search`: Search for games by title or description (case-insensitive).
    * **Response:** Returns an object containing an array of games, the current page number, the total number of pages, and the total number of games.
* **GET /api/games/:id**: Retrieves a specific game by its ID.
    * **Path Parameter:** `id`: The ID of the game.
    * **Response:** Returns the details of the requested game.
* **POST /api/games/admin**: Adds a new game to the catalog (Admin only).
    * **Headers:** Requires a valid JWT token with admin role in the `Authorization` header (Bearer token).
    * **Request Body (multipart/form-data):**
        ```form-data
        title: game name
        description: game description
        platform: platform
        genre: genre
        price: 29.99
        stock: 100
        image: upload image 
        ```
    * **Response:** Returns the details of the newly created game.
* **PUT /api/games/admin/:id**: Updates an existing game (Admin only).
    * **Headers:** Requires a valid JWT token with admin role in the `Authorization` header (Bearer token).
    * **Path Parameter:** `id`: The ID of the game to update.
    * **Request Body (multipart/form-data):** Similar to the POST request, with fields to update. Fields are optional.
        ```form-data
        title: new game name (optional)
        price: 39.99 (optional)
        stock: 50 (optional)
        image: upload a new image (optional)
        ```
    * **Response:** Returns the details of the updated game.
* **DELETE /api/games/admin/:id**: Deletes a game from the catalog (Admin only).
    * **Headers:** Requires a valid JWT token with admin role in the `Authorization` header (Bearer token).
    * **Path Parameter:** `id`: The ID of the game to delete.
    * **Response:** Returns a message indicating that the game has been removed.

### Shopping Cart

* **POST /api/cart**: Adds a game to the user's shopping cart.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Request Body:**
        ```json
        {
            "gameId": "gameObjectId",
            "quantity": 2
        }
        ```
    * **Response:** Returns the updated cart details with a success message.
* **GET /api/cart**: Retrieves the authenticated user's shopping cart.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Response:** Returns the user's cart details, including items and total price.
* **PATCH /api/cart/update**: Updates the quantity of a game in the cart or removes it.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Request Body:**
        ```json
        {
            "gameId": "gameObjectId",
            "removeQty": 1 // Optional: quantity to remove. If not provided or >= current quantity, the item is removed.
        }
        ```
    * **Response:** Returns the updated cart details with a success message.
* **PUT /api/cart/clear**: Clears all items from the user's shopping cart.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Response:** Returns the cleared cart details with a success message.

### Order Management

* **POST /api/orders**: Places an order based on the items in the user's shopping cart.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Response:** Returns the details of the placed order.
* **GET /api/orders**: Retrieves the order history for the authenticated user.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Response:** Returns an array of the user's past orders.
* **GET /api/orders/:id**: Retrieves a specific order by its ID for the authenticated user.
    * **Headers:** Requires a valid JWT token in the `Authorization` header (Bearer token).
    * **Path Parameter:** `id`: The ID of the order.
    * **Response:** Returns the details of the requested order.




## Database Schema

The project uses MongoDB with Mongoose for data modeling. The key schemas are:

* **User:** Stores user information including `name`, `email` (unique), `password` (hashed), and `role` (`user` or `admin`).
* **Game:** Stores game details such as `title` (unique), `description`, `platform`, `genre`, `price`, `stock`, and `imageUrl`.
* **Cart:** Stores the shopping cart for each user, including a reference to the `User`, an array of `games` (each with `gameId`, `quantity`, and `price`), and the `totalPrice`.
* **Order:** Stores order information including a reference to the `User`, an array of `items` (each referencing a `Game` with `quantity` and `price`), `totalPrice`, `status`, and `orderedAt` timestamp.

## Authentication and Authorization

User authentication is implemented using JWT. Upon successful login, the user receives a JWT that needs to be included in the `Authorization` header as a Bearer token for accessing protected routes.

Role-based access control is implemented using middleware (`protect` and `authorizeRoles`). The `protect` middleware verifies the JWT and identifies the user. The `authorizeRoles` middleware checks if the authenticated user's role matches the allowed roles for a specific route, allowing only admin users to access game management endpoints.

## Middleware Used

* **morgan:** Used for logging HTTP requests to the console during development.
* **errorHandler:** A custom middleware used for handling errors globally and providing consistent error responses.
* **protect (Auth.middleware.js):** Authenticates users based on the JWT token in the request header.
* **authorizeRoles (Auth.middleware.js):** Authorizes users based on their role to access specific routes.
* **validate (validation.middleware.js):** Uses `express-validator` to validate request body and parameters.

## File Uploads

Game cover images are uploaded using the `multer` middleware. Images are stored in the `uploads` directory on the server, and the file path is stored in the `imageUrl` field of the `Game` model.

## Validation

Input validation is implemented using the `express-validator` library to ensure data integrity and prevent common security vulnerabilities. Validation rules are defined in the `validation` folder and applied to relevant routes using the `validate` middleware.

## Postman Collection

You can import 
[Game TeamProject](https://restless-meadow-459784.postman.co/workspace/Team-Workspace~e795dc71-82dd-4b38-897d-9ef8e68c5f41/collection/39966075-216cb9af-fa93-4829-b697-d05c6c1ca727?action=share&creator=39966075)
into Postman to easily test all the API endpoints. The endpoints are organized into separate folders for easier navigation: `users`, `games`, `cart`, and `order`.

## Future Enhancements 


* **Reviews:** Allowing users to leave reviews for games and displaying average ratings.
* **Categories:** Implementing categories for games and allowing users to filter by category.
* **Wishlist:** Enabling users to add games to a personal wishlist.

## Testing

Testing for this project is not implemented in this version. Future development could include unit and integration tests to ensure the API's reliability and correctness.




## Author

* Mohamed Refaat  [Github](https://github.com/mohmedRefat)
* Yara Maher  [Github](https://github.com/yaraboualsood)
* Sohaila Mohamed  [Github](https://github.com/sohaila293)
* Amr Ibrahim  [Github](https://github.com/amr-ibrahim7)
