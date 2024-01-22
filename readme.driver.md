# WCT API Documentation

This documentation provides information on the Driver API endpoints.

### Driver SignIn

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/driver/signIn`

**Request Body**

```
{
  email:"asdasd@dsa.com",
  password:"sdaasd"
}
```

### Driver Assigned rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

This Endpoint is responsible for fetching the assigned rides of driver

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/driver/assignedRides`

### Driver Completed Rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

This Endpoint is responsible for fetching the completed rides of driver

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/driver/completedRides`

### Driver Payments

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

This Endpoint is responsible for fetching the Payments

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/driver/payments`

### Driver details

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

This Endpoint is responsible for fetching the driver details

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/driver/getDetails`

### Driver Forgot Pwd

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

This Endpoint is responsible for changing the pwd

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/driver/forgotPassword`

**Request Body**

```
{
    email:"asdadz@domain.com"
}
```
