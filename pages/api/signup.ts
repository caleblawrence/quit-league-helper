import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import axios from "axios";

interface User {
  name: string;
  summonerNames: string[];
  currentSreak: number;
  highestStreak: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const instance = axios.create({
    timeout: 1000,
    headers: { "X-Riot-Token": "RGAPI-1c2f50ad-dcf5-44e8-87e4-9a092b4dbc8f" },
  });

  const { db } = await connectToDatabase();
  let newUser: User;

  // TODO: make sure the type is setup correclty (enforce schema)
  newUser = req.body;
  newUser.currentSreak = 0;
  newUser.highestStreak = 0;

  const invalidSummonerNames = [];

  for (let x in newUser.summonerNames) {
    let summonerName = newUser.summonerNames[x];

    try {
      const response = await instance.get(
        "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
          summonerName
      );
    } catch (error) {
      invalidSummonerNames.push(summonerName);
    }
  }

  if (invalidSummonerNames.length > 0) {
    return res
      .status(400)
      .json({ error: "Invalid summoner names.", invalidSummonerNames });
  }

  db.collection("users").insertOne(newUser);
  return res.json({ status: "success" });
};
