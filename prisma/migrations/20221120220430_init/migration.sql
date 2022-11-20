-- CreateTable
CREATE TABLE "Hotel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "category_stars" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelid" INTEGER NOT NULL,
    "departuredate" DATETIME NOT NULL,
    "returndate" DATETIME NOT NULL,
    "countadults" INTEGER NOT NULL,
    "countchildren" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "inbounddepartureairport" TEXT NOT NULL,
    "inboundarrivalairport" TEXT NOT NULL,
    "outboundarrivalairport" TEXT NOT NULL,
    "outboundarrivaldatetime" DATETIME NOT NULL,
    "mealtype" TEXT NOT NULL,
    "oceanview" BOOLEAN NOT NULL,
    "roomtype" TEXT NOT NULL,
    CONSTRAINT "Offer_hotelid_fkey" FOREIGN KEY ("hotelid") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");
