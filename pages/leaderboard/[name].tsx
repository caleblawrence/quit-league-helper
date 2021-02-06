import { useRouter } from "next/router";
import Head from "next/head";
import LeaderBoardRow from "../../components/leaderboard/leaderBoardRow";
import React from "react";
import Error from "next/error";
import { Alert } from "@material-ui/lab";
import { User } from "@prisma/client";
import prisma from "../../lib/prisma";
import checkUserMatchhistory from "../api/check-user-matchhistory";
import MatchHistoryLastChecked from "../../components/matchhistoryLastChecked";

interface Props {
  users: User[];
}

function Leaderboard(props: Props) {
  const router = useRouter();
  const { name } = router.query;
  const { users } = props;

  if (users == null) {
    return <Error statusCode={404} />;
  }
  return (
    <div className="container">
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle">{name}</h1>
        <MatchHistoryLastChecked />
        <br />

        {users.map((user) => (
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
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  var name = context.params.name;

  let leaderboard = await prisma.customLeaderboard.findFirst({
    where: {
      name: name,
    },
    select: {
      UserCustomLeaderboard: {
        select: {
          user: true,
        },
      },
    },
  });

  let users = leaderboard.UserCustomLeaderboard.map((item) => item.user);

  users.sort((a, b) => b.currentStreak - a.currentStreak);

  return {
    props: { users: users },
  };
}

export default Leaderboard;
