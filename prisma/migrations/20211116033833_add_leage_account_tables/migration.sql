-- DropForeignKey
ALTER TABLE "UserCustomLeaderboard" DROP CONSTRAINT "UserCustomLeaderboard_customLeaderboardId_fkey";

-- DropForeignKey
ALTER TABLE "UserCustomLeaderboard" DROP CONSTRAINT "UserCustomLeaderboard_userId_fkey";

-- CreateTable
CREATE TABLE "LeagueAccount" (
    "id" SERIAL NOT NULL,
    "summonerName" TEXT NOT NULL,
    "puuid" TEXT,
    "isInvalid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLeagueAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "leagueAccountId" INTEGER NOT NULL,

    CONSTRAINT "UserLeagueAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLeagueAccount" ADD CONSTRAINT "UserLeagueAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeagueAccount" ADD CONSTRAINT "UserLeagueAccount_leagueAccountId_fkey" FOREIGN KEY ("leagueAccountId") REFERENCES "LeagueAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomLeaderboard" ADD CONSTRAINT "UserCustomLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomLeaderboard" ADD CONSTRAINT "UserCustomLeaderboard_customLeaderboardId_fkey" FOREIGN KEY ("customLeaderboardId") REFERENCES "CustomLeaderboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
