import Head from "next/head";
import { User } from "../types/User";
import { connectToDatabase } from "../util/mongodb";
import LeaderBoardRow from "../components/leaderboard/leaderBoardRow";

interface Props {
  topUsers: User[];
}
export default function Leaderboard(props: Props) {
  const { topUsers } = props;
  return (
    <div className="container">
      <Head>
        <title>Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle">Leaderboard</h1>
        {topUsers.map((user) => (
          <LeaderBoardRow user={user} />
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
        }

        @media only screen and (max-width: 600px) {
          .sectionTitle {
            font-size: 30px;
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

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const topUsers = await db
    .collection("users")
    .find({})
    .sort({ currentSreak: -1 })
    .limit(100)
    .toArray();

  return {
    props: { topUsers: JSON.parse(JSON.stringify(topUsers)) },
  };
}
