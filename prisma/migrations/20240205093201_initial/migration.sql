/*
  Warnings:

  - Changed the type of `password` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "email" VARCHAR(128),
DROP COLUMN "password",
ADD COLUMN     "password" BYTEA NOT NULL;
