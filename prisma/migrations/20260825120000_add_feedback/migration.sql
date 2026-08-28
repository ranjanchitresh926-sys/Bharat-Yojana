-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
