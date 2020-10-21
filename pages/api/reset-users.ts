import { NextApiRequest, NextApiResponse } from "next";
import { Streak } from "../../types/Streak";
import { connectToDatabase } from "../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();
  await db.collection("users").remove({});
  await db.collection("streaks").remove({});

  var result = await db.collection("users").insertOne({
    name: "Noah Lawrence",
    summonerNames: ["C11H15NO2", "séè yöu sóòn", "HÔT GÎRL BÛMMÊR"],
    currentSreak: 0,
  });

  let newUserId = result["ops"][0]["_id"];

  let newStreak = <Streak>{};
  newStreak.startDate = new Date(2020, 9, 14);
  newStreak.endDate = null;
  newStreak.userId = newUserId;

  await db.collection("streaks").insertOne(newStreak);

  var result2 = await db.collection("users").insertOne({
    name: "Caleb Lawrence",
    summonerNames: ["yarn start", "alizabethkai"],
    currentSreak: 0,
  });

  let newUserId2 = result2["ops"][0]["_id"];

  let newStreak2 = <Streak>{};
  newStreak2.startDate = new Date(2020, 9, 17);
  newStreak2.endDate = null;
  newStreak2.userId = newUserId2;

  await db.collection("streaks").insertOne(newStreak2);

  return res.json({ status: "success" });
};
