var axios = require("axios");
import prisma from "../lib/prisma";

const checkIfUsersArePlaying = async () => {
  const { LEAGUE_API_KEY } = process.env;

  const axiosInstance = axios.create({
    timeout: 1000,
    headers: {
      "X-Riot-Token": LEAGUE_API_KEY,
    },
  });

  // leave early if we can't connect
  let canConnect = await canConnectToRiotApi(axiosInstance);
  if (!canConnect) {
    throw new Error("Can't connect to Riot Api. Check your Api token.");
  }

  const users = await prisma.user.findMany();

  for (const user of users) {
    let latestDatePlayed = new Date(-8640000000000000);
    for (const summonerName of user.summonerNames) {
      var lastGameOnAccount = await getDateOfLastGameForSummoner(
        summonerName,
        axiosInstance
      );

      if (lastGameOnAccount > latestDatePlayed) {
        latestDatePlayed = lastGameOnAccount;
      }
    }

    // dont care about hours/min/sec
    latestDatePlayed.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany();

    const lastSteakForUser = await prisma.streak.findFirst({
      where: { id: user.id },
      orderBy: {
        startDate: "asc",
      },
    });

    if (lastSteakForUser == undefined || lastSteakForUser == null) {
      console.log(`[ERROR] no streak existed for user: ${user.name}"`);
    }

    const lastStreakStartDate = new Date(lastSteakForUser.startDate);

    // dont care about hours/min/sec
    lastStreakStartDate.setHours(0, 0, 0, 0);

    console.log(
      `[INFO] User: ${user.name} played their last game on ${latestDatePlayed} and their last streak startdate was ${lastStreakStartDate}.`
    );

    if (latestDatePlayed > lastStreakStartDate) {
      console.log(
        `[INFO] Streak was ended for user: ${user.name}. Creaing a new one.`
      );

      await prisma.streak.update({
        where: { id: lastSteakForUser.id },
        data: { endDate: new Date() },
      });

      await prisma.streak.create({
        data: {
          startDate: new Date(),
          endDate: null,
          userId: user.id,
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { currentStreak: 0 },
      });
    } else {
      console.log(`[INFO] Streak continues for user: ${user.name}.`);
      // To calculate the time difference of two dates
      var differenceInTime = new Date().getTime() - latestDatePlayed.getTime();

      // To calculate the no. of days between two dates
      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      differenceInDays = Math.floor(differenceInDays);

      await prisma.user.update({
        where: { id: user.id },
        data: { currentStreak: differenceInDays },
      });
    }
  }
};

const getDateOfLastGameForSummoner = async (
  summonerName: string,
  axiosInstance: any
): Promise<Date> => {
  let accountId = "";
  try {
    var URI = encodeURI(
      "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
        summonerName
    );

    const summonerAccountInformation = await axiosInstance.get(URI);
    accountId = summonerAccountInformation.data.accountId;
  } catch (error) {
    console.log(
      `[WARNING] Could not get summoner accountId through riot api for summonername: ${summonerName}. Status code: ${error?.response?.status}`
    );
  }

  try {
    const response = await axiosInstance.get(
      "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
        accountId +
        "?champion=&queue=&season=&endTime=&beginTime=&endIndex=&beginIndex="
    );

    let lastGameDate = new Date(response.data.matches[0].timestamp);
    return lastGameDate;
  } catch (error) {
    console.log(
      `[WARNING] could not get summoner match history through riot api for summonerName: ${summonerName}. Status code: ${error?.response?.status}`
    );
  }
};

const canConnectToRiotApi = async (axiosInstance: any) => {
  try {
    var URI = encodeURI(
      "https://na1.api.riotgames.com//lol/platform/v3/champion-rotations"
    );

    await axiosInstance.get(URI);
    console.log("Was able to connect to RIOT api. Continuing...");
  } catch (error) {
    console.log(
      `[ERROR] riot API could not be reached with token. Status code: ${error?.response?.status}`
    );
    return false;
  }
  return true;
};

export { checkIfUsersArePlaying };
