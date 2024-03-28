/*
  Warnings:

  - You are about to drop the column `loadType` on the `Rides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Rides" DROP COLUMN "loadType",
ADD COLUMN     "load" TEXT NOT NULL DEFAULT 'NULL';
