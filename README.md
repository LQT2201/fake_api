# Fake Store API Documentation

This API provides endpoints for a mock e-commerce store, allowing you to perform CRUD operations on products, carts, users, and orders.

## Base URL

```
http://localhost:6400
```

## Authentication

Some endpoints require authentication. Use the `/auth/login` endpoint to obtain a JWT token.

```
POST /auth/login
```

Include the token in your requests using the Authorization header:

```
Authorization: Bearer YOUR_TOKEN
```

## Products API

### Get All Products

Retrieves a list of all products.

```
GET /products
```

#### Query Parameters

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| limit     | number | Limit the number of results (optional)           |
| sort      | string | Sort order: 'asc' (default) or 'desc' (optional) |

#### Response Example

```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack",
    "price": 109.95,
    "description": "Your perfect pack for everyday use",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "rating": {
      "rate": 3.9,
      "count": 120
    }
  }
  // More products...
]
```

### Get Product by ID

Retrieve a specific product by its ID.

```
GET /products/:id
```

#### Response Example

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack",
  "price": 109.95,
  "description": "Your perfect pack for everyday use",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  "rating": {
    "rate": 3.9,
    "count": 120
  }
}
```

### Get Product Categories

Retrieve all available product categories.

```
GET /products/categories
```

#### Response Example

```json
["electronics", "jewelery", "men's clothing", "women's clothing"]
```

### Get Products in Category

Retrieve all products in a specific category.

```
GET /products/category/:category
```

#### Query Parameters

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| limit     | number | Limit the number of results (optional)           |
| sort      | string | Sort order: 'asc' (default) or 'desc' (optional) |

#### Response Example

```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack",
    "price": 109.95,
    "description": "Your perfect pack for everyday use",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "rating": {
      "rate": 3.9,
      "count": 120
    }
  }
  // More products in the same category...
]
```

### Add a New Product

Add a new product to the database.

```
POST /products
```

#### Request Body

```json
{
  "title": "New Product",
  "price": 99.99,
  "description": "A description of the product",
  "image": "https://example.com/image.jpg",
  "category": "electronics",
  "rating": {
    "rate": 0,
    "count": 0
  }
}
```

#### Response

Returns the created product with an assigned ID.

### Update a Product

Update an existing product.

```
PUT /products/:id
PATCH /products/:id
```

#### Request Body

Include any fields you want to update:

```json
{
  "title": "Updated Product Name",
  "price": 129.99
}
```

#### Response

Returns the updated product.

### Delete a Product

Delete a product from the database.

```
DELETE /products/:id
```

#### Response Example

```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "deletedProduct": {
    // Product details
  }
}
```

## Users API

### Get All Users

Retrieve a list of all users.

```
GET /users
```

#### Query Parameters

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| limit     | number | Limit the number of results (optional)           |
| sort      | string | Sort order: 'asc' (default) or 'desc' (optional) |

#### Response Example

```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "username": "johnd",
    "name": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "address": {
      "city": "kilcoole",
      "street": "7835 new road",
      "number": 3,
      "zipcode": "12926-3874",
      "geolocation": {
        "lat": "-37.3159",
        "long": "81.1496"
      }
    },
    "phone": "1-570-236-7033"
  }
  // More users...
]
```

### Get User by ID

Retrieve a specific user by their ID.

```
GET /users/:id
```

#### Response Example

```json
{
  "id": 1,
  "email": "john@example.com",
  "username": "johnd",
  "name": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "address": {
    "city": "kilcoole",
    "street": "7835 new road",
    "number": 3,
    "zipcode": "12926-3874",
    "geolocation": {
      "lat": "-37.3159",
      "long": "81.1496"
    }
  },
  "phone": "1-570-236-7033"
}
```

### Register a New User

Register a new user.

```
POST /users
```

#### Request Body

```json
{
  "email": "new.user@example.com",
  "username": "newuser",
  "password": "password123",
  "firstname": "New",
  "lastname": "User",
  "address": {
    "city": "New York",
    "street": "123 Main St",
    "zipcode": "10001"
  },
  "phone": "123-456-7890"
}
```

Note: Only the fields you include will be added to the user. Missing fields will be set to default values.

#### Response

Returns the created user with an assigned ID.

### Update a User

Update an existing user.

```
PUT /users/:id
PATCH /users/:id
```

#### Request Body

Include any fields you want to update:

```json
{
  "email": "updated.email@example.com",
  "phone": "987-654-3210"
}
```

#### Response

Returns the updated user information.

### Delete a User

Delete a user from the database.

```
DELETE /users/:id
```

#### Response Example

```json
{
  "status": "success",
  "message": "User deleted successfully",
  "deletedUser": {
    // User details
  }
}
```

## Carts API

### Get All Carts

Retrieve all shopping carts.

```
GET /carts
```

#### Query Parameters

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| limit     | number | Limit the number of results (optional)           |
| sort      | string | Sort order: 'asc' (default) or 'desc' (optional) |
| startdate | string | Filter by start date (format: YYYY-MM-DD)        |
| enddate   | string | Filter by end date (format: YYYY-MM-DD)          |

#### Response Example

```json
[
  {
    "id": 1,
    "userId": 1,
    "date": "2020-03-02T00:00:00.000Z",
    "products": [
      {
        "productId": 1,
        "quantity": 4
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ]
  }
  // More carts...
]
```

### Get Cart by ID

Retrieve a specific cart by its ID.

```
GET /carts/:id
```

#### Response Example

```json
{
  "id": 1,
  "userId": 1,
  "date": "2020-03-02T00:00:00.000Z",
  "products": [
    {
      "productId": 1,
      "quantity": 4
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

### Get User's Carts

Retrieve all carts for a specific user.

```
GET /carts/user/:userid
```

#### Query Parameters

| Parameter | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| startdate | string | Filter by start date (format: YYYY-MM-DD) |
| enddate   | string | Filter by end date (format: YYYY-MM-DD)   |

#### Response Example

```json
[
  {
    "id": 1,
    "userId": 1,
    "date": "2020-03-02T00:00:00.000Z",
    "products": [
      {
        "productId": 1,
        "quantity": 4
      },
      {
        "productId": 2,
        "quantity": 1
      }
    ]
  }
  // More carts for this user...
]
```

### Add a New Cart

Create a new shopping cart.

```
POST /carts
```

#### Request Body

```json
{
  "userId": 1,
  "date": "2023-11-08T14:12:20.809Z",
  "products": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 5,
      "quantity": 1
    }
  ]
}
```

#### Response

Returns the created cart with an assigned ID.

### Update a Cart

Update an existing cart.

```
PUT /carts/:id
PATCH /carts/:id
```

#### Request Body

Include any fields you want to update:

```json
{
  "products": [
    {
      "productId": 1,
      "quantity": 3
    },
    {
      "productId": 5,
      "quantity": 2
    }
  ]
}
```

#### Response

Returns the updated cart.

### Delete a Cart

Delete a cart from the database.

```
DELETE /carts/:id
```

#### Response Example

```json
{
  "status": "success",
  "message": "Cart deleted successfully",
  "deletedCart": {
    // Cart details
  }
}
```

### Checkout

Process a cart checkout to create an order.

```
POST /carts/:id/checkout
```

#### Request Body

```json
{
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Cash on Delivery"
}
```

#### Response Example

```json
{
  "status": "success",
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "userId": 1,
    "cartId": 5,
    "products": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 109.95,
        "title": "Fjallraven - Foldsack No. 1 Backpack",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
      }
    ],
    "totalAmount": 219.9,
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Cash on Delivery",
    "paymentStatus": "Pending",
    "status": "Processing",
    "createdAt": "2023-11-08T14:15:22.809Z",
    "updatedAt": "2023-11-08T14:15:22.809Z"
  }
}
```

## Orders API

### Get All Orders

Retrieve all orders.

```
GET /orders
```

#### Query Parameters

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| limit     | number | Limit the number of results (optional)           |
| sort      | string | Sort order: 'asc' (default) or 'desc' (optional) |

#### Response Example

```json
[
  {
    "id": 1,
    "userId": 1,
    "cartId": 5,
    "products": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 109.95,
        "title": "Fjallraven - Foldsack No. 1 Backpack",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
      }
    ],
    "totalAmount": 219.9,
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Cash on Delivery",
    "paymentStatus": "Pending",
    "status": "Processing",
    "createdAt": "2023-11-08T14:15:22.809Z",
    "updatedAt": "2023-11-08T14:15:22.809Z"
  }
  // More orders...
]
```

### Get Order by ID

Retrieve a specific order by its ID.

```
GET /orders/:id
```

#### Response Example

```json
{
  "id": 1,
  "userId": 1,
  "cartId": 5,
  "products": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 109.95,
      "title": "Fjallraven - Foldsack No. 1 Backpack",
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    }
  ],
  "totalAmount": 219.9,
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Cash on Delivery",
  "paymentStatus": "Pending",
  "status": "Processing",
  "createdAt": "2023-11-08T14:15:22.809Z",
  "updatedAt": "2023-11-08T14:15:22.809Z"
}
```

### Get User's Orders

Retrieve all orders for a specific user.

```
GET /orders/user/:userid
```

#### Response Example

```json
[
  {
    "id": 1,
    "userId": 1,
    "cartId": 5,
    "products": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 109.95,
        "title": "Fjallraven - Foldsack No. 1 Backpack",
        "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
      }
    ],
    "totalAmount": 219.9,
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Cash on Delivery",
    "paymentStatus": "Pending",
    "status": "Processing",
    "createdAt": "2023-11-08T14:15:22.809Z",
    "updatedAt": "2023-11-08T14:15:22.809Z"
  }
  // More orders for this user...
]
```

### Update Order Status

Update the status of an existing order.

```
PATCH /orders/:id
```

#### Request Body

```json
{
  "status": "Shipped",
  "paymentStatus": "Paid"
}
```

#### Response

Returns the updated order.

### Delete an Order

Delete an order from the database.

```
DELETE /orders/:id
```

#### Response Example

```json
{
  "status": "success",
  "message": "Order deleted successfully",
  "deletedOrder": {
    // Order details
  }
}
```

## Authentication API

### Login

Authenticate a user and get a JWT token.

```
POST /auth/login
```

#### Request Body

```json
{
  "username": "johnd",
  "password": "m38rmF$"
}
```

#### Response Example

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiam9obmQiLCJfaWQiOjEsImlhdCI6MTYwNDU5MzEwMH0.oyH0M_HGMu4iu6UG4L_bN4myFXGideUeJzH7DC6KEbY"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: A new resource was successfully created
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required
- `404 Not Found`: The requested resource does not exist
- `500 Internal Server Error`: An error occurred on the server

Error responses include a message explaining what went wrong:

```json
{
  "status": "error",
  "message": "User not found"
}
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the server with `npm start`
4. Seed the database with `npm run seed`

For more information, refer to the [GitHub repository](https://github.com/yourusername/fake-store-api).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
