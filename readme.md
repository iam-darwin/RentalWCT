# WCT API Documentation
This documentation provides information on the API endpoints.    


## Admin End Points

Below are the details for the Admin end points 

### Add driver

**METHOD** : `POST`
**URL**    : `http://localhost:PORT/api/v1/admin/addDriver`

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

  **METHOD** : `GET`
  **URL**    : `http://localhost:PORT/api/v1/admin/drivers`

  **Request Body**

    > No need to send anything


### Get Driver By ID

**METHOD** : `GET`
 **URL**    : `http://localhost:PORT/api/v1/admin/driver/:id`

  **Request Params**
  ```
    {
        id:"JHAKJGSJAHSGAHSGAJHSGJ" //Access using **req.params.id** 
    }
  ```
### Get Active Drivers
  **METHOD** : `GET`
     **URL**    : `http://localhost:PORT/api/v1/admin/activeDrivers`

   **Request Body**

    > No need to send anything

### Uploading CSV FIles


 **METHOD** : `POST`
     **URL**    : `http://localhost:PORT/api/v1/admin/fileUpload`

    >Just upload the file with key : csvFile

### Get Unassigned Rides


 **METHOD** : `GET`
     **URL**    : `http://localhost:PORT/api/v1/admin/unAssignedRides`

 **Request Body**

    > No need to send anything assignRide

### Assign ride to driver

**METHOD** : `GET`
     **URL**    : `http://localhost:PORT/api/v1/admin/assignRide`

**Request Body**

```
{
    "rideID":"123123123",
    "driverId":"asdasdsdad"
}
```

### Get Assigned Rides

 **METHOD** : `GET`
     **URL**    : `http://localhost:PORT/api/v1/admin/assignedRides`

 **Request Body**

    > No need to send anything 

### Update Driver Details

**METHOD** : `GET`
     **URL**    : `http://localhost:PORT/api/v1/admin/updateDriverDetails`

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