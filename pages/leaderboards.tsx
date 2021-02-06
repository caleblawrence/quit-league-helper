import Head from "next/head";
import React from "react";
import prisma from "../lib/prisma";
import { CustomLeaderboard } from "@prisma/client";
import BuildLeaderboardButton from "../components/buildLeaderboardButton";
import LeaderboardSummary from "../components/leaderboardSummary";
//TODO: fix this any typ
interface Props {
  leaderboards: any[];
}

function Leaderboard(props: Props) {
  const { leaderboards } = props;
  return (
    <div className="container">
      <Head>
        <title>Leaderboards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle">Leaderboards</h1>

        <BuildLeaderboardButton />

        {leaderboards.map((leaderboard) => (
          <LeaderboardSummary leaderboard={leaderboard} />
        ))}
      </main>

      <style jsx>{`
        .container {
          margin-right: auto; /* 1 */
          margin-left: auto; /* 1 */

          max-width: 960px; /* 2 */

          padding-right: 10px; /* 3 */
          padding-left: 10px; /* 3 */
        }

        .sectionTitle {
          font-size: 50px;
          margin-bottom: 5px;
        }

        @media only screen and (max-width: 600px) {
          .sectionTitle {
            font-size: 35px;
          }
        }

        a {
          color: white !important;
          text-decoration: none !important; /* no underline */
        }
        body {
          background-color: rgba(0, 0, 0, 1) !important;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const leaderboards = await prisma.customLeaderboard.findMany({
    orderBy: {
      id: "desc",
    },
    include: { UserCustomLeaderboard: { include: { user: true } } },
  });

  return {
    props: { leaderboards: leaderboards },
    revalidate: 1,
  };
}

export default Leaderboard;
