import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

const lastMatchHistoryCheck = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const auditRecord = await prisma.matchHistoryServiceAudit.findFirst({
    orderBy: { date: "desc" },
    select: {
      date: true,
    },
  });
  return res.json(auditRecord);
};

export default lastMatchHistoryCheck;
