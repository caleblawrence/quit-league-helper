import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";

interface User {
  name: string;
  summonerNames: string[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();
  let newUser: User;

  // TODO: make sure the type is setup correclty (enforce schema)
  newUser = req.body;

  db.collection("users").insertOne(newUser);
  res.json({ status: "success" });
};
