import { NextApiRequest, NextApiResponse } from "next";
import { checkIfUsersArePlaying } from "../../util/leagueMatchHistoryService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await checkIfUsersArePlaying();
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.json({ status: "success" });
};
