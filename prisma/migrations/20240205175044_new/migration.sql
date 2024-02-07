-- CreateTable
CREATE TABLE "Admin" (
    "adminId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Driver" (
    "driverID" TEXT NOT NULL,
    "driverFirstName" TEXT NOT NULL,
    "driverLastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "driverAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "driverPhoneNumber1" TEXT NOT NULL,
    "driverPhoneNumber2" TEXT NOT NULL,
    "vehicleColor" TEXT NOT NULL,
    "vehicleMake" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleLicense" TEXT NOT NULL,
    "driverLicense" TEXT NOT NULL,
    "driverSSN" TEXT NOT NULL,
    "lastPaymentDate" TEXT NOT NULL DEFAULT 'NULL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("driverID")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentID" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "driverID" TEXT NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "remarks" TEXT NOT NULL DEFAULT 'NULL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentID")
);

-- CreateTable
CREATE TABLE "Rides_Kaizen" (
    "ID" SERIAL NOT NULL,
    "RideID" TEXT NOT NULL,
    "Ride_Status" TEXT NOT NULL,
    "Ride_Date" TEXT NOT NULL,
    "Customer_FirstName" TEXT NOT NULL,
    "Customer_LastName" TEXT NOT NULL,
    "Phone_Number" TEXT NOT NULL,
    "Transportation_Type" TEXT NOT NULL,
    "Cancel_Reason" TEXT NOT NULL,
    "Cost" TEXT NOT NULL,
    "Pick_Up_Time" TEXT NOT NULL,
    "Arrival_Time" TEXT NOT NULL,
    "Estimated_Arrival_Time" TEXT NOT NULL,
    "Scheduled_Pickup_Time" TEXT NOT NULL,
    "Estimated_Distance" TEXT NOT NULL,
    "Pickup_Address" TEXT NOT NULL,
    "Pickup_Lat" TEXT,
    "Pickup_Lng" TEXT,
    "Pickup_Directions" TEXT,
    "Dropoff_Address" TEXT,
    "Dropoff_Lat" TEXT,
    "Dropoff_Lng" TEXT,
    "Dropoff_Directions" TEXT,
    "Driver_FirstName" TEXT,
    "Driver_Photo_Url" TEXT,
    "Driver_Phone" TEXT,
    "Vehicle_Color" TEXT,
    "Vehicle_Make" TEXT,
    "Vehicle_Model" TEXT,
    "Vehicle_License" TEXT,
    "Vehicle_Photo_Url" TEXT,
    "Provider_Name" TEXT,
    "Provider_Trip_Id" TEXT,
    "Rider_Patient_ID" TEXT,
    "Member_ID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rides_Kaizen_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Rides" (
    "RideID" TEXT NOT NULL,
    "Ride_Status" TEXT NOT NULL,
    "Ride_Date" TEXT NOT NULL,
    "Customer_FirstName" TEXT NOT NULL,
    "Customer_LastName" TEXT NOT NULL,
    "Phone_Number" TEXT NOT NULL,
    "Transportation_Type" TEXT NOT NULL,
    "Cancel_Reason" TEXT NOT NULL,
    "Cost" TEXT NOT NULL,
    "Pick_Up_Time" TEXT NOT NULL,
    "Arrival_Time" TEXT NOT NULL,
    "Estimated_Arrival_Time" TEXT NOT NULL,
    "Scheduled_Pickup_Time" TEXT NOT NULL,
    "Estimated_Distance" TEXT NOT NULL,
    "Pickup_Address" TEXT NOT NULL,
    "Pickup_Lat" TEXT NOT NULL,
    "Pickup_Lng" TEXT NOT NULL,
    "Pickup_Directions" TEXT NOT NULL,
    "Dropoff_Address" TEXT NOT NULL,
    "Dropoff_Lat" TEXT NOT NULL,
    "Dropoff_Lng" TEXT NOT NULL,
    "Dropoff_Directions" TEXT NOT NULL,
    "Driver_ID" TEXT NOT NULL,
    "Provider_Trip_Id" TEXT NOT NULL,
    "Rider_Patient_ID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rides_pkey" PRIMARY KEY ("RideID")
);

-- CreateTable
CREATE TABLE "CompletedRides" (
    "RideID" TEXT NOT NULL,
    "Ride_Status" TEXT NOT NULL,
    "Ride_Date" TEXT NOT NULL,
    "Customer_FirstName" TEXT NOT NULL,
    "Customer_LastName" TEXT NOT NULL,
    "Phone_Number" TEXT NOT NULL,
    "Transportation_Type" TEXT NOT NULL,
    "Cancel_Reason" TEXT NOT NULL,
    "Cost" TEXT NOT NULL,
    "Pick_Up_Time" TEXT NOT NULL,
    "Arrival_Time" TEXT NOT NULL,
    "Estimated_Arrival_Time" TEXT NOT NULL,
    "Scheduled_Pickup_Time" TEXT NOT NULL,
    "Estimated_Distance" TEXT NOT NULL,
    "Pickup_Address" TEXT NOT NULL,
    "Pickup_Lat" TEXT NOT NULL,
    "Pickup_Lng" TEXT NOT NULL,
    "Pickup_Directions" TEXT NOT NULL,
    "Dropoff_Address" TEXT NOT NULL,
    "Dropoff_Lat" TEXT NOT NULL,
    "Dropoff_Lng" TEXT NOT NULL,
    "Dropoff_Directions" TEXT NOT NULL,
    "Driver_ID" TEXT NOT NULL,
    "Provider_Trip_Id" TEXT NOT NULL,
    "Rider_Patient_ID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedRides_pkey" PRIMARY KEY ("RideID")
);

-- CreateTable
CREATE TABLE "Customer" (
    "CustomerID" TEXT NOT NULL,
    "Customer_FirstName" TEXT NOT NULL,
    "Customer_LastName" TEXT NOT NULL,
    "Phone_Number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("CustomerID")
);

-- CreateTable
CREATE TABLE "ContactUsForm" (
    "contactID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT CHECKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactUsForm_pkey" PRIMARY KEY ("contactID")
);

-- CreateTable
CREATE TABLE "UserRide" (
    "rideId" SERIAL NOT NULL,
    "rideStatus" TEXT NOT NULL DEFAULT 'PENDING UPDATE',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "rideDate" TEXT NOT NULL,
    "pickUpTime" TEXT NOT NULL,
    "pickUpAddress" TEXT NOT NULL,
    "dropOffAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "instructions" TEXT NOT NULL DEFAULT 'NULL',
    "driverId" TEXT NOT NULL DEFAULT 'NULL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRide_pkey" PRIMARY KEY ("rideId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_adminId_key" ON "Admin"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverID_key" ON "Driver"("driverID");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_vehicleLicense_key" ON "Driver"("vehicleLicense");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverLicense_key" ON "Driver"("driverLicense");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driverSSN_key" ON "Driver"("driverSSN");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentID_key" ON "Payment"("paymentID");

-- CreateIndex
CREATE UNIQUE INDEX "Rides_Kaizen_RideID_key" ON "Rides_Kaizen"("RideID");

-- CreateIndex
CREATE UNIQUE INDEX "Rides_RideID_key" ON "Rides"("RideID");

-- CreateIndex
CREATE UNIQUE INDEX "CompletedRides_RideID_key" ON "CompletedRides"("RideID");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_CustomerID_key" ON "Customer"("CustomerID");

-- CreateIndex
CREATE UNIQUE INDEX "UserRide_rideId_key" ON "UserRide"("rideId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_driverID_fkey" FOREIGN KEY ("driverID") REFERENCES "Driver"("driverID") ON DELETE RESTRICT ON UPDATE CASCADE;
