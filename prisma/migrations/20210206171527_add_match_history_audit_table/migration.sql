-- CreateTable
CREATE TABLE "MatchHistoryServiceAudit" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "couldConnectToRiotApi" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);
