import { Streak } from "../types/Streak";

var axios = require("axios");
var mongoUtils = require("../util/mongodb");

const { LEAGUE_API_KEY } = process.env;

const checkIfUsersArePlaying = async () => {
  const { db } = await mongoUtils.connectToDatabase();
  const users = await db
    .collection("users")
    .find({})
    .sort({ metacritic: -1 })
    .toArray();

  for (const user of users) {
    let latestDatePlayed = new Date(-8640000000000000);
    for (const summonerName of user.summonerNames) {
      var lastGameOnAccount = await getDateOfLastGameForSummoner(summonerName);
      if (lastGameOnAccount > latestDatePlayed) {
        latestDatePlayed = lastGameOnAccount;
      }
    }

    // dont care about hours/min/sec
    latestDatePlayed.setHours(0, 0, 0, 0);

    const userLastStreaks = await db
      .collection("streaks")
      .find({ userId: user._id, endDate: null })
      .sort({ startDate: -1 })
      .limit(1)
      .toArray();

    if (userLastStreaks == []) {
      console.log("[ERROR] no streak existed for user: ", user.name);
    }

    let lastStreak = userLastStreaks[0];

    const lastStreakStartDate = new Date(lastStreak.startDate);

    // dont care about hours/min/sec
    lastStreakStartDate.setHours(0, 0, 0, 0);

    console.log(
      "User: " +
        user.name +
        " played their last game on: " +
        latestDatePlayed +
        " and their last streak startdate was: " +
        lastStreakStartDate
    );

    if (latestDatePlayed > lastStreakStartDate) {
      console.log("Streak was ended - creaing a new one.");
      await db.collection("streaks").updateOne(
        { _id: lastStreak._id },
        {
          $set: {
            startDate: lastStreak.startDate,
            endDate: new Date(),
            userId: lastStreak.userId,
          },
        }
      );

      let newStreak = <Streak>{};
      newStreak.startDate = new Date();
      newStreak.endDate = null;
      newStreak.userId = lastStreak.userId;

      await db.collection("streaks").insertOne(newStreak);
    } else {
      console.log("Streak continues");
      // To calculate the time difference of two dates
      var differenceInTime = new Date().getTime() - latestDatePlayed.getTime();

      // To calculate the no. of days between two dates
      var differenceInDays = differenceInTime / (1000 * 3600 * 24);
      differenceInDays = Math.floor(differenceInDays);

      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            name: user.name,
            summonerNames: user.summonerNames,
            currentSreak: differenceInDays,
          },
        }
      );
    }
  }
};

const getDateOfLastGameForSummoner = async (
  summonerName: string
): Promise<Date> => {
  const instance = axios.create({
    timeout: 1000,
    headers: {
      "X-Riot-Token": LEAGUE_API_KEY,
    },
  });

  let accountId = "";
  try {
    var URI = encodeURI(
      "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
        summonerName
    );

    const summonerAccountInformation = await instance.get(URI);
    accountId = summonerAccountInformation.data.accountId;
  } catch (error) {
    console.log(
      "[ERROR] could not get summoner accountId through riot api. Status code:",
      error.response.status
    );
  }

  try {
    const response = await instance.get(
      "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" +
        accountId +
        "?champion=&queue=&season=&endTime=&beginTime=&endIndex=&beginIndex="
    );

    let lastGameDate = new Date(response.data.matches[0].timestamp);
    return lastGameDate;
  } catch (error) {
    console.log(
      "[ERROR] could not get summoner match history through riot api. Status code:",
      error.response.status
    );
  }
};

export { checkIfUsersArePlaying };
