# WCT API Documentation

This documentation provides information on the Adimn API endpoints.

## Starting the Application

To start the application :

1. Clone the repo and Navigate to the folder

2. Install the necessary dependencies using npm :

   ```bash
   npm i
   ```

3. Run the application in development mode :
   ```bash
   npm run dev
   ```

---

## Admin End Points

Below are the details for the Admin end points

### Admin Signup

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/signUp`

**Request Body**

```
{
  name:"asdasd",
  email:"asdasd@dsa.com",
  password:"sdaasd"
  role:"SUPER ADMIN" //if you're testing application make sure you're a super admin (By default it will be admin)
}
```

### Admin SignIn

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/signIn`

**Request Body**

```
{
  email:"asdasd@dsa.com",
  password:"sdaasd"
}
```

after this make sure to token in the header **Authorization:TOKEN**

### Add driver

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:PORT/api/v1/admin/addDriver`

**Request Body**

```
{
  "driverFirstName"         :"JOEY",
  "driverLastName"          :"TRIBBIANI",
  "email"                   :"joey@iamjoey.com",
  "password"                :"Joey@143",
  "driverAddress"           :"Earth PLanet",
  "driverPhoneNumber1"      :"989098909890",
  "driverPhoneNumber2"      :"09813209813290231" //can be empty
  "vehicleColor"            :"Black",
  "vehicleMake"             :"BWM",   //BRAND
  "vehicleModel"            :"X7"
  "vehicleLicense"          :"AXAX098989"
  "driverLicense"           :"ASSASA9889"
  "driverSSN"               :"ASASLP0909090"
}
```

### Get All Drivers

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/drivers`

**Request Body**

    > No need to send anything

### Get Driver By ID

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/driver/:id`

**Request Params**

```
  {
      driverID:"JHAKJGSJAHSGAHSGAJHSGJ" //Access using **req.params.id**
  }
```

### Get Active Drivers

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/activeDrivers`

**Request Body**

    > No need to send anything

### Uploading CSV FIles

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:PORT/api/v1/admin/fileUpload`

    >Just upload the file with key : csvFile

### Get Unassigned Rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/unAssignedRides`

**Request Body**

    > No need to send anything assignRide

### Assign ride to driver

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:PORT/api/v1/admin/assignRide`

**Request Body**

```
{
    "rideId":"123123123",
    "driverId":"asdasdsdad"
}
```

### Get Assigned Rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/assignedRides`

**Request Body**

    > No need to send anything

### Update Ride As Completed

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:PORT/api/v1/admin/updateRideAsCompleted`

**Request Body**

```
{
  rideId:"asdasd"
}

```

### Update Assigned Rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:PORT/api/v1/admin/updateAssignRides`

**Request Body**

```
{
  //Send fields you want to update either Ride_status or Driver Reassign. you'll be sending only one of them
  rideId:"asdasdasd",
  Driver_ID:"asdasasd",
  Ride_Status:"CANCELLED"
}
```

### Get Completed Rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/completedRides`

### Get Cancelled Rides

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:PORT/api/v1/admin/cancelledRides`

### Update Driver Details

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:PORT/api/v1/admin/updateDriverDetails/:driverId`

**Request Params**

```
{
    "driverId":"asdasdasd"
}
```

**Request Body**

```
{
    //send all the fields which you want to update
    name:"Chandler",
}
```

### UPDATE ADMIN DETAILS

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`POST`
**URL** :`http://localhost:PORT/api/v1/admin/updateAdmin`

**Request Body**

```
{
   adminId:"asdadsda",
  //send what ever fields you want to update among them
  //one of them must be sent
  name?:"JOey",
  role?:"SUPER ADMIN",
  email?:"asdasd@lamdsv.com"
}
```

### ADD NEW ADMIN

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`POST`
**URL** :`http://localhost:PORT/api/v1/admin/addAdmin`

**Request Body**

```
{
  name:"JOEY",
  email:"iamojey@lamdsv.com",
  password:"88888888",
  role?:"SUPER ADMIN" //if you dont provide by default it will create "ADMIN"
}
```

### Remove ADMIN

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`POST`
**URL** :`http://localhost:PORT/api/v1/admin/removeAdmin`

**Request Body**

```
{
  driverId:"asdasdadsasd"
}
```

### Get ALL ADMINS

Before proceeding to this route, make sure to sign in first. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`GET`
**URL** :`http://localhost:PORT/api/v1/admin/admins`

### Add Payment Info

Before proceeding to this route, make sure to sign in first Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`POST`
**URL** :`http://localhost:PORT/api/v1/admin/createPayment`

**Request Body**

{
driverId:"asdasdasd",
amount:"1320",
remarks:"Enjoy with this"
date?: "2024-01-10T12:53:38.729Z" //format
}

### Get All Payments

Before proceeding to this route, make sure to sign in first Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`GET`
**URL** :`http://localhost:PORT/api/v1/admin/getAllPayments`

### Get Payments By DriverID

Before proceeding to this route, make sure to sign in first Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`GET`
**URL** :`http://localhost:PORT/api/v1/admin/payment/:driverId`

**Request Params**
`{
      driverId:"asdasdasd"
}`

### Update Payments

Before proceeding to this route, make sure to sign in first as Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** :`POST`
**URL** :`http://localhost:8000/api/v1/admin/payments/:paymentId`

**Request Params**
`{
      paymentId:"asdasdasd" 
}`

**Request Body**

```
{
  date?:"2024-01-10T12:53:38.729Z" //format
  remarks:"just checking updation",
  amount:"756"
}
```

### Admin Forgot Pwd

This Endpoint is responsible for changing the pwd

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/forgotPassword`

**Request Body**

```
{
    email:"asdadz@domain.com"
}
```

### Form Details(Not Contacted)

Before proceeding to this route, make sure to sign in first as Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/admin/getFormDetailsNotContacted`

### Update Form Data(Contacted)

Before proceeding to this route, make sure to sign in first as Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/updateFormContact/:contactId` //mention the contactId in the params

### Form Details(Contacted)

Before proceeding to this route, make sure to sign in first as Super Admin. Once signed in, the server will generate a JWT token that should be kept in the headers

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/admin/getFormDetailsContacted`

# User ride routes

### Add User Ride

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/addUserRide`

**Request Body**

```
{
    "firstName":"asdadz@domain.com",
    "lastName":"asdasd",
    "rideDate":"1234567890",
    "pickUpTime":"asdasdsadsad",
    "pickUpAddress":"asdasdasdsadasd",
    "dropOffAddress":"asdasdasdsadasd",
    "phoneNumber":"9876919921",
    "instructions"?:"optional",
}
```

**Response**

```
{
  "message": "Ride successfully added",
  "details": {
    "rideId": 1,
    "rideStatus": "PENDING UPDATE",
    "firstName": "asdadz@domain.com",
    "lastName": "asdasd",
    "rideDate": "1234567890",
    "pickUpTime": "asdasdsadsad",
    "pickUpAddress": "asdasdasdsadasd",
    "dropOffAddress": "asdasdasdsadasd",
    "phoneNumber": "9876919921",
    "instructions": "NULL",
    "driverId": "NULL",
    "createdAt": "2024-02-03T19:57:57.228Z",
    "updatedAt": "2024-02-03T19:57:57.228Z"
  }
}
```

### Get Unassigned User Rides

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/admin/getUnassignedUserRides`

**Response**

```
{
  "message": "Details fetched successfully",
  "details": [
    {
      "rideId": 1,
      "rideStatus": "PENDING UPDATE",
      "firstName": "asdadz@domain.com",
      "lastName": "asdasd",
      "rideDate": "1234567890",
      "pickUpTime": "asdasdsadsad",
      "pickUpAddress": "asdasdasdsadasd",
      "dropOffAddress": "asdasdasdsadasd",
      "phoneNumber": "9876919921",
      "instructions": "NULL",
      "driverId": "NULL",
      "createdAt": "2024-02-03T19:57:57.228Z",
      "updatedAt": "2024-02-03T19:57:57.228Z"
    }
  ]
}
```

### Assign driver to user ride

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/assignUserRideToDriver`

**Request Body**

```
{
  "rideId":"123123123",
  "driverId":"asdasdsdad"
}
```

### Assign driver to user ride

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/assignUserRideToDriver`

**Request Body**

```
{
  "rideId":"123123123",
  "driverId":"asdasdsdad"
}
```

### get User Assigned Rides

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/admin/getUserAssignedRides`

**Request Body Empty**

### Update User Assigned Rides

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/updateUserRides`

**Request Body**

```
{
  "rideId":"123123123",
  "driverId":"asdasdsdad"
}
```

### Update User Assigned Rides as completed

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/updateUserRideAsCompleted`

**Request Body**

```
{
  "rideId":"123123123",
}
```

### Update User Assigned Rides as Cancelled

**METHOD** : `POST`
**URL** : `http://localhost:8000/api/v1/admin/updateUserRideAsCancelled`

**Request Body**

```
{
  "rideId":"123123123",
}
```

### Get completed UserRides

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/admin/getCompletedUserRides`

### Get Cancelled UserRides

**METHOD** : `GET`
**URL** : `http://localhost:8000/api/v1/admin/getCancelledUserRides`
