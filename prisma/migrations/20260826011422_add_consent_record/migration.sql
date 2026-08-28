-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "citizenId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "noticeVersion" TEXT NOT NULL,
    "consentedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawnAt" DATETIME
);
