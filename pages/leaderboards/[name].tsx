import { useRouter } from "next/router";

import Head from "next/head";
import { User } from "../../types/User";
import { connectToDatabase } from "../../util/mongodb";
import LeaderBoardRow from "../../components/leaderboard/leaderBoardRow";
import React from "react";
import Error from "next/error";
import { Alert } from "@material-ui/lab";

interface Props {
  topUsers: User[];
}

function Leaderboard(props: Props) {
  const router = useRouter();
  const { name } = router.query;
  const { topUsers } = props;

  if (topUsers == null) {
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

        <Alert
          severity="warning"
          style={{ marginBottom: 20, backgroundColor: "rgb(43 29 7)" }}
        >
          I'm still waiting on a real Riot API Token so this is only updated
          about once every couple days.
        </Alert>

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
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { db } = await connectToDatabase();
  var name = context.params.name;

  let leaderboard = await db
    .collection("customLeaderboards")
    .find({ name: name })
    .limit(1)
    .toArray();

  if (leaderboard.length == 0) {
    return {
      props: { topUsers: null },
    };
  }

  leaderboard = leaderboard[0];

  let userIds = leaderboard.userIds;

  const topUsers = await db
    .collection("users")
    .find({ _id: { $in: userIds } })
    .sort({ currentSreak: -1 })
    .limit(100)
    .toArray();

  return {
    props: { topUsers: JSON.parse(JSON.stringify(topUsers)) },
  };
}

export default Leaderboard;
