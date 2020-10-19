import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();
  await db.collection("users").remove({});

  await db.collection("users").insertOne({
    name: "Noah Lawrence",
    summonerNames: ["C11H15NO2", "séè yöu sóòn", "HÔT GÎRL BÛMMÊR"],
    currentSreak: 0,
    highestStreak: 0,
  });

  await db.collection("users").insertOne({
    name: "Caleb Lawrence",
    summonerNames: ["yarn start", "alizabethkai"],
    currentSreak: 0,
    highestStreak: 0,
  });

  return res.json({ status: "success" });
};
