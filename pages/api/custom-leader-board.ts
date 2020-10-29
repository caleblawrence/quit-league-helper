import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";
import axios from "axios";
import { User } from "../../types/User";
import { Streak } from "../../types/Streak";

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

  return res.json({ status: "success" });
};
