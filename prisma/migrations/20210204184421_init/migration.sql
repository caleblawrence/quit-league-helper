-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "summonerNames" TEXT[],
    "currentStreak" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomLeaderboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCustomLeaderboard" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "customLeaderboardId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Streak" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomLeaderboard" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomLeaderboard" ADD FOREIGN KEY ("customLeaderboardId") REFERENCES "CustomLeaderboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
