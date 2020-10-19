import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();
  await db.collection("users").remove({});
};
