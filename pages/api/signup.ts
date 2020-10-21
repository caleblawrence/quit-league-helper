import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import axios from "axios";
import { User } from "../../types/User";
import { Streak } from "../../types/Streak";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const instance = axios.create({
    timeout: 1000,
    headers: { "X-Riot-Token": "RGAPI-1c2f50ad-dcf5-44e8-87e4-9a092b4dbc8f" },
  });

  const { db } = await connectToDatabase();
  let newUser: User;

  if (
    !req.body.hasOwnProperty("name") ||
    req.body.name == null ||
    req.body.name == "" ||
    !req.body.hasOwnProperty("summonerNames") ||
    req.body.summonerNames == null
  ) {
    return res
      .status(400)
      .json({ error: "name and summonerNames required in the body." });
  }

  newUser = req.body;
  newUser.currentSreak = 0;
  newUser.summonerNames = newUser.summonerNames.filter((x) => x.trim() != "");

  const invalidSummonerNames = [];

  for (let x in newUser.summonerNames) {
    let summonerName = newUser.summonerNames[x];

    try {
      const response = await instance.get(
        "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
          summonerName
      );
    } catch (error) {
      // if the league api could not be reached we should skip validations.
      if (error.response.status === 404) {
        invalidSummonerNames.push(summonerName);
      } else {
        console.log("could not validate summoner name because of API error");
        // TODO: log this - means api could not be reached for some reason and no summoner name validation is happneing
      }
    }
  }

  if (invalidSummonerNames.length > 0) {
    return res
      .status(400)
      .json({ error: "Invalid summoner names.", invalidSummonerNames });
  }

  var result = await db.collection("users").insertOne(newUser);
  let newUserId = result["ops"][0]["_id"];

  let newStreak = <Streak>{};
  newStreak.startDate = new Date();
  newStreak.endDate = null;
  newStreak.userId = newUserId;

  await db.collection("streaks").insertOne(newStreak);

  return res.json({ status: "success" });
};
