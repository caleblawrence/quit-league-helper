import { NextApiRequest, NextApiResponse } from "next";
import { checkIfUsersArePlaying } from "../../util/leagueMatchHistoryService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await checkIfUsersArePlaying();
  return res.json({ status: "success" });
};
