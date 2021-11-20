/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// this is a temp route for a data migration
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({});
  for (const user of users) {
    for (const summonerName of user.summonerNames) {
      let leagueAccount = null;
      let existingLeagueAccounts = await prisma.leagueAccount.findMany({
        where: {
          summonerName: summonerName,
        },
      });
      if (existingLeagueAccounts.length > 0) {
        leagueAccount = existingLeagueAccounts[0];
      } else {
        leagueAccount = await prisma.leagueAccount.create({
          data: {
            summonerName: summonerName,
          },
        });
      }

      // todo: create leageue user
      await prisma.userLeagueAccount.create({
        data: {
          leagueAccountId: leagueAccount.id,
          userId: user.id,
        },
      });
    }
  }

  return res.json({ status: "success" });
};
