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
  return res.json(auditRecord);
};
