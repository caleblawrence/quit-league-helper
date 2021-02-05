import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const { LEAGUE_API_KEY } = process.env;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();

  // TODO: abstract the validation into it's own method
  const instance = axios.create({
    timeout: 1000,
    headers: { "X-Riot-Token": LEAGUE_API_KEY },
  });

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

  req.body.summonerNames = req.body.summonerNames.filter((x) => x.trim() != "");
  if (req.body.summonerNames.length == 0) {
    return res.status(400).json({
      error: "A valid list of summonerNames is required.",
    });
  }

  const invalidSummonerNames = [];

  for (let summonerName in req.body.summonerNames) {
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

  await prisma.user.create({
    data: {
      name: req.body.name,
      currentStreak: 0,
      summonerNames: req.body.summonerNames,
      Streak: {
        create: {
          startDate: new Date(),
          endDate: null,
        },
      },
    },
  });

  return res.json({ status: "success" });
};
