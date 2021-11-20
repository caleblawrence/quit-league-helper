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
    include: {
      UserLeagueAccount: {
        include: {
          LeagueAccount: true,
        },
      },
    },
  });

  for (const user of users) {
    let latestDatePlayed = null;
    let lastAccountPlayedOn = null;
    for (const userLeagueAccount of user.UserLeagueAccount) {
      if (userLeagueAccount.LeagueAccount.isInvalid) {
        continue;
      }

      const summonerName = userLeagueAccount.LeagueAccount.summonerName;
      let accountPuuid = userLeagueAccount.LeagueAccount.puuid;

      // if this is null than it is a recenetly added accounta and we don't have the puuid for it yet
      if (accountPuuid == null) {
        try {
          // `data is in response.data.puuid`
          var URI = encodeURI(
            "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
              summonerName
          );

          const summonerAccountInformation = await axiosInstance.get(URI);
          accountPuuid = summonerAccountInformation.data.puuid;
          await prisma.leagueAccount.update({
            where: {
              id: userLeagueAccount.LeagueAccount.id,
            },
            data: {
              puuid: accountPuuid,
            },
          });
        } catch (error) {
          console.log(
            `[WARNING] Could not get summoner puuid through riot api for summonername: ${summonerName}. Status code: ${error?.response?.status}`
          );
          if (error?.response?.status === 404) {
            console.log(
              `[INFO] Setting ${summonerName} to be isInvalid because the summoner name does not exist`
            );
            await prisma.leagueAccount.update({
              where: {
                id: userLeagueAccount.LeagueAccount.id,
              },
              data: {
                isInvalid: true,
              },
            });
          }
        }
      }

      let lastGameOnAccount: Date;
      try {
        const latestMatchesResponse = await axiosInstance.get(
          `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${accountPuuid}/ids?start=0&count=20`
        );
        const lastMatchId = latestMatchesResponse.data[0];
        const latestMatchData = await axiosInstance.get(
          `https://americas.api.riotgames.com/lol/match/v5/matches/${lastMatchId}`
        );

        lastGameOnAccount = new Date(latestMatchData.data.info.gameCreation);
      } catch (error) {
        console.log(
          `[WARNING] could not get summoner match history through riot api for summonerName: ${summonerName}. Status code: ${error?.response?.status}`
        );

        if (error?.response?.status === 404) {
          console.log(
            `[INFO] Setting ${summonerName} to be isInvalid because they don't have any matches in their match history`
          );
          await prisma.leagueAccount.update({
            where: {
              id: userLeagueAccount.LeagueAccount.id,
            },
            data: {
              isInvalid: true,
            },
          });
        }
      }

      if (lastGameOnAccount == null) {
        continue;
      }

      if (lastGameOnAccount > latestDatePlayed || latestDatePlayed === null) {
        latestDatePlayed = lastGameOnAccount;
        lastAccountPlayedOn = userLeagueAccount.LeagueAccount.summonerName;
      }
    }

    // if the all the account names are invalid or something we want to exit early
    if (latestDatePlayed === null) {
      `[INFO] User: ${user.name} does not have a valid account.`;
      continue;
    }

    console.log(
      `[INFO] User: ${user.name} played their last game on ${latestDatePlayed} (with ${lastAccountPlayedOn}).`
    );

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
};

export { checkIfUsersArePlaying };
