/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'DRIVER', 'PASSENGER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "public"."VehicleStatus" AS ENUM ('AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."TripStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DELAYED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'WALLET');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('STRIPE', 'ORANGE_MONEY', 'WAVE', 'MODEM_PAY');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('BOOKING_CONFIRMATION', 'BOOKING_CANCELLED', 'TRIP_DEPARTURE', 'TRIP_DELAYED', 'TRIP_ARRIVED', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'FARE_UPDATE', 'SYSTEM_ALERT');

-- DropForeignKey
ALTER TABLE "public"."Fare" DROP CONSTRAINT "Fare_fromLocalityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Fare" DROP CONSTRAINT "Fare_toLocalityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Fare" DROP CONSTRAINT "Fare_vehicleTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."Fare" ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "originalPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'PASSENGER',
ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fromLocalityId" INTEGER NOT NULL,
    "toLocalityId" INTEGER NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION,
    "estimatedDuration" INTEGER,
    "waypoints" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "id" SERIAL NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "routeId" INTEGER NOT NULL,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "lastLocationUpdate" TIMESTAMP(3),
    "capacity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleLocation" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trip" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "estimatedArrival" TIMESTAMP(3) NOT NULL,
    "actualArrival" TIMESTAMP(3),
    "status" "public"."TripStatus" NOT NULL DEFAULT 'SCHEDULED',
    "occupiedSeats" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TripTracking" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "passengerId" INTEGER NOT NULL,
    "fareId" INTEGER NOT NULL,
    "seatNumber" TEXT,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "bookingReference" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GMD',
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "public"."PaymentProvider" NOT NULL DEFAULT 'STRIPE',
    "metaData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminDashboard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "activePassengers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyStatistics" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalBookings" INTEGER NOT NULL DEFAULT 0,
    "totalTrips" INTEGER NOT NULL DEFAULT 0,
    "activeVehicles" INTEGER NOT NULL DEFAULT 0,
    "completedTrips" INTEGER NOT NULL DEFAULT 0,
    "cancelledTrips" INTEGER NOT NULL DEFAULT 0,
    "avgOccupancy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PriceHistory" (
    "id" SERIAL NOT NULL,
    "fareId" INTEGER NOT NULL,
    "previousPrice" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "changedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER,
    "changes" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_fromLocalityId_toLocalityId_vehicleTypeId_key" ON "public"."Route"("fromLocalityId", "toLocalityId", "vehicleTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "public"."Vehicle"("licensePlate");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "public"."Vehicle"("status");

-- CreateIndex
CREATE INDEX "Vehicle_operatorId_idx" ON "public"."Vehicle"("operatorId");

-- CreateIndex
CREATE INDEX "VehicleLocation_vehicleId_idx" ON "public"."VehicleLocation"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleLocation_timestamp_idx" ON "public"."VehicleLocation"("timestamp");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "public"."Trip"("status");

-- CreateIndex
CREATE INDEX "Trip_departureTime_idx" ON "public"."Trip"("departureTime");

-- CreateIndex
CREATE INDEX "TripTracking_tripId_idx" ON "public"."TripTracking"("tripId");

-- CreateIndex
CREATE INDEX "TripTracking_recordedAt_idx" ON "public"."TripTracking"("recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingReference_key" ON "public"."Booking"("bookingReference");

-- CreateIndex
CREATE INDEX "Booking_passengerId_idx" ON "public"."Booking"("passengerId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "public"."Booking"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tripId_seatNumber_key" ON "public"."Booking"("tripId", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "public"."Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "public"."Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "public"."Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "public"."Payment"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "public"."Notification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "AdminDashboard_userId_key" ON "public"."AdminDashboard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStatistics_date_key" ON "public"."DailyStatistics"("date");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "public"."AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Fare_isActive_idx" ON "public"."Fare"("isActive");

-- CreateIndex
CREATE INDEX "Locality_region_idx" ON "public"."Locality"("region");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- AddForeignKey
ALTER TABLE "public"."Fare" ADD CONSTRAINT "Fare_fromLocalityId_fkey" FOREIGN KEY ("fromLocalityId") REFERENCES "public"."Locality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fare" ADD CONSTRAINT "Fare_toLocalityId_fkey" FOREIGN KEY ("toLocalityId") REFERENCES "public"."Locality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fare" ADD CONSTRAINT "Fare_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "public"."VehicleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_fromLocalityId_fkey" FOREIGN KEY ("fromLocalityId") REFERENCES "public"."Locality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_toLocalityId_fkey" FOREIGN KEY ("toLocalityId") REFERENCES "public"."Locality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "public"."VehicleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "public"."VehicleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleLocation" ADD CONSTRAINT "VehicleLocation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TripTracking" ADD CONSTRAINT "TripTracking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_fareId_fkey" FOREIGN KEY ("fareId") REFERENCES "public"."Fare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminDashboard" ADD CONSTRAINT "AdminDashboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceHistory" ADD CONSTRAINT "PriceHistory_fareId_fkey" FOREIGN KEY ("fareId") REFERENCES "public"."Fare"("id") ON DELETE CASCADE ON UPDATE CASCADE;
