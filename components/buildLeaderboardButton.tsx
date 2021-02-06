import Link from "next/link";
import { Button } from "@material-ui/core";

const BuildLeaderboardButton = () => (
  <>
    <Link href="/leaderboard/new">
      <Button color="primary" style={{ marginBottom: 0 }}>
        Build a custom leaderboard
      </Button>
    </Link>

    <p
      style={{
        color: "#797272",
        marginTop: 0,
        marginLeft: 7,
        paddingTop: 0,
        marginBottom: 5,
      }}
    >
      Custom leaderboards are a great way to compete with your friends.
    </p>
  </>
);

export default BuildLeaderboardButton;
