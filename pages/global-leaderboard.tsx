import Head from "next/head";
import LeaderBoardRow from "../components/leaderboard/leaderBoardRow";
import React from "react";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";
import BuildLeaderboardButton from "../components/buildLeaderboardButton";
import MatchHistoryLastChecked from "../components/matchhistoryLastChecked";

interface Props {
  topUsers: User[];
}

function Leaderboard(props: Props) {
  const { topUsers } = props;

  return (
    <div className="container">
      <Head>
        <title>Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle">Global Leaderboard</h1>
        <MatchHistoryLastChecked />
        <BuildLeaderboardButton />
        <br />

        {topUsers.map((user) => (
          <LeaderBoardRow user={user} key={user.name} />
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
  const users = await prisma.user.findMany({
    take: 100,
    select: {
      summonerNames: true,
      currentStreak: true,
      name: true,
      longestStreak: true,
    },
    orderBy: {
      currentStreak: "desc",
    },
  });

  return {
    props: { topUsers: users },
    revalidate: 1,
  };
}

export default Leaderboard;
