-- CreateTable
CREATE TABLE "GrievanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
