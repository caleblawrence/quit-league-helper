import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const auditRecord = await prisma.matchHistoryServiceAudit.findFirst({
    orderBy: { date: "desc" },
    where: { couldConnectToRiotApi: true },
    select: {
      date: true,
      couldConnectToRiotApi: true,
    },
  });
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return res.json(auditRecord);
};
