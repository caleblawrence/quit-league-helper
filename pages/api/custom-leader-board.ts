import { CustomLeaderboard } from "./../../types/CustomLeaderboard";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();

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

  let userIds = [];
  let summonerNamesNotFound = [];
  for (let summonnerName of req.body.summonerNames) {
    const user = await db
      .collection("users")
      .find({ summonerNames: summonnerName })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    if (user && user.length > 0) {
      userIds.push(user[0]._id);
    } else {
      summonerNamesNotFound.push(summonnerName);
    }
  }

  console.log("userIds", userIds);
  console.log("summonerNamesNotFound", summonerNamesNotFound);

  if (summonerNamesNotFound.length > 0) {
    return res
      .status(400)
      .json({ error: "Invalid summoner names.", summonerNamesNotFound });
  }

  let customLeaderboard = <CustomLeaderboard>{};
  customLeaderboard.name = req.body.name;
  customLeaderboard.createdAt = new Date();
  customLeaderboard.userIds = userIds;

  await db.collection("customLeaderboards").insertOne(customLeaderboard);

  return res.json({ status: "success" });
};
