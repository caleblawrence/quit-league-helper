import Head from "next/head";
import React, { useState } from "react";
import prisma from "../lib/prisma";
import BuildLeaderboardButton from "../components/buildLeaderboardButton";
import LeaderboardSummary from "../components/leaderboardSummary";
import { TextField } from "@material-ui/core";
//TODO: fix this any typ
interface Props {
  leaderboards: any[];
}

function Leaderboard(props: Props) {
  const { leaderboards } = props;
  const [searchValue, setSearchValue] = useState("");
  const filteredLeaderboards = leaderboards.filter((leaderboard) =>
    leaderboard.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="container">
      <Head>
        <title>Leaderboards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle">Leaderboards</h1>

        <BuildLeaderboardButton />

        <TextField
          label="Search leaderboards"
          variant="standard"
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginTop: 0, paddingTop: 0, marginBottom: 10 }}
        />

        {!filteredLeaderboards.length && "No leaderboards found."}
        {filteredLeaderboards.map((leaderboard) => (
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
    include: {
      UserCustomLeaderboard: {
        include: {
          user: {
            select: {
              summonerNames: true,
              currentStreak: true,
              name: true,
              longestStreak: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { leaderboards: leaderboards },
    revalidate: 1,
  };
}

export default Leaderboard;
