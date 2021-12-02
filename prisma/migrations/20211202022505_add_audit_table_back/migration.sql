-- CreateTable
CREATE TABLE "MatchHistoryServiceAudit" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistoryServiceAudit_pkey" PRIMARY KEY ("id")
);
