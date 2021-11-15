var axios = require("axios");
import prisma from "./prisma";

const checkIfUsersArePlaying = async () => {
  const { LEAGUE_API_KEY } = process.env;

  const axiosInstance = axios.create({
    timeout: 1000,
    headers: {
      "X-Riot-Token": LEAGUE_API_KEY,
    },
  });

  let canConnect = await canConnectToRiotApi(axiosInstance);
  if (!canConnect) {
    await prisma.matchHistoryServiceAudit.create({
      data: {
        couldConnectToRiotApi: false,
      },
    });
    throw new Error("Can't connect to Riot Api. Check your Api token.");
  }

  // only get users that have not been updated in the last 24 hours
  // this is just in case the function times out in the middle of the run (max 10 seconds it can run)
  // so this enables it to continually update the users that have not been updated yet
  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 24);
  const users = await prisma.user.findMany({
    where: {
      lastModifiedTime: {
        lt: currentDate,
      },
    },
  });

  for (const user of users) {
    let latestDatePlayed = null;
    let lastAccountPlayedOn = null;
    for (const summonerName of user.summonerNames) {
      var lastGameOnAccount = await getDateOfLastGameForSummoner(
        summonerName,
        axiosInstance
      );

      if (lastGameOnAccount == null) {
        continue;
      }

      if (lastGameOnAccount > latestDatePlayed || latestDatePlayed === null) {
        latestDatePlayed = lastGameOnAccount;
        lastAccountPlayedOn = summonerName;
      }
    }

    console.log(
      `[INFO] User: ${user.name} played their last game on ${latestDatePlayed} (with ${lastAccountPlayedOn}).`
    );

    // if the all the account names are invalid or something we want to exit early
    if (latestDatePlayed == null) {
      continue;
    }

    // To calculate the time difference of two dates
    var differenceInTime = new Date().getTime() - latestDatePlayed.getTime();

    // To calculate the no. of days between two dates
    let daysSinceLastGame = differenceInTime / (1000 * 3600 * 24);
    daysSinceLastGame = Math.floor(daysSinceLastGame);

    var longestStreakForUser = user.longestStreak;
    if (daysSinceLastGame > longestStreakForUser) {
      longestStreakForUser = daysSinceLastGame;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: daysSinceLastGame,
        longestStreak: longestStreakForUser,
        lastModifiedTime: new Date(),
      },
    });
  }

  // all rows defaulted
  await prisma.matchHistoryServiceAudit.create({
    data: {},
  });
};

const getDateOfLastGameForSummoner = async (
  summonerName: string,
  axiosInstance: any
): Promise<Date> => {
  let accountPuuid = "";
  try {
    // `data is in response.data.puuid`
    var URI = encodeURI(
      "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
        summonerName
    );

    const summonerAccountInformation = await axiosInstance.get(URI);
    accountPuuid = summonerAccountInformation.data.puuid;
  } catch (error) {
    console.log(
      `[WARNING] Could not get summoner accountId through riot api for summonername: ${summonerName}. Status code: ${error?.response?.status}`
    );
  }

  try {
    const latestMatchesResponse = await axiosInstance.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountPuuid}/ids?start=0&count=20`
    );
    const lastMatchId = latestMatchesResponse.data[0];
    const latestMatchData = await axiosInstance.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${lastMatchId}`
    );

    let lastGameDate = new Date(latestMatchData.data.info.gameCreation);
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
      "https://na1.api.riotgames.com/lol/status/v3/shard-data"
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
