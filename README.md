# Fake Store API

A RESTful API for a fake online store that supports full CRUD operations for products, carts, and users.

## Setup

1. Make sure you have Node.js and MongoDB installed
2. Clone this repository
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=6400
   DATABASE_URL=mongodb://localhost:27017/fake-store
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```

## Testing with Postman

1. Import the included Postman collection file (`fake-store-api-postman-collection.json`)
2. The collection uses an environment variable `baseUrl` which is set to `http://localhost:6400` by default
3. If your API is running on a different host or port, update the `baseUrl` variable in the Postman environment settings

## Available Endpoints

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get a single product by ID
- `GET /products/categories` - Get all product categories
- `GET /products/category/:category` - Get products in a specific category
- `POST /products` - Add a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Carts

- `GET /carts` - Get all carts
- `GET /carts/:id` - Get a single cart by ID
- `GET /carts/user/:userid` - Get carts by user ID
- `POST /carts` - Add a new cart
- `PUT /carts/:id` - Update a cart
- `DELETE /carts/:id` - Delete a cart

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get a single user by ID
- `POST /users` - Add a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Authentication

- `POST /auth/login` - Login with username and password

## Query Parameters

Many endpoints support the following query parameters:

- `limit` - Limit the number of results returned
- `sort` - Sort results (asc or desc)

The carts endpoints also support date filtering:

- `startdate` - Filter carts from this date (format: YYYY-MM-DD)
- `enddate` - Filter carts until this date (format: YYYY-MM-DD)

## Examples

### Creating a Product

```json
POST /products
{
  "title": "Test Product",
  "price": 99.99,
  "description": "This is a test product",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  "category": "electronics"
}
```

### Creating a User

```json
POST /users
{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123",
  "firstname": "Test",
  "lastname": "User",
  "address": {
    "city": "Test City",
    "street": "Test Street",
    "number": 123,
    "zipcode": "12345",
    "geolocation": {
      "lat": "40.7128",
      "long": "-74.0060"
    }
  },
  "phone": "123-456-7890"
}
```

### Creating a Cart

```json
POST /carts
{
  "userId": 1,
  "date": "2023-05-20",
  "products": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```
