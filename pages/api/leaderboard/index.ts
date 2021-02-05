import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: abstract validation to make this easier to read
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

  let userIds: number[] = [];
  let summonerNamesNotFound = [];
  for (let summonnerName of req.body.summonerNames) {
    console.log("looking for summoner name: ", summonnerName);
    let user = await prisma.user.findFirst({
      where: {
        summonerNames: {
          has: summonnerName,
        },
      },
    });

    if (user != null) {
      userIds.push(+user.id);
    } else {
      summonerNamesNotFound.push(summonnerName);
    }
  }

  if (summonerNamesNotFound.length > 0) {
    return res
      .status(400)
      .json({ error: "Invalid summoner names.", summonerNamesNotFound });
  }

  var newLeaderboard = await prisma.customLeaderboard.create({
    data: {
      name: req.body.name,
      UserCustomLeaderboard: {
        create: userIds.map((userId) => ({ userId: userId })),
      },
    },
  });

  return res.json({ newLeaderboard });
};
