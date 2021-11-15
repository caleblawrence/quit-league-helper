import { Button, Link, Paper } from "@material-ui/core";
import { CustomLeaderboard, User, UserCustomLeaderboard } from "@prisma/client";
import React from "react";

interface Props {
  leaderboard: CustomLeaderboard & {
    UserCustomLeaderboard: UserCustomLeaderboard &
      {
        user: User;
      }[];
  };
}

function LeaderboardSummary(props: Props) {
  const { leaderboard } = props;

  let currentLeader: User | null = null;
  leaderboard.UserCustomLeaderboard.forEach((item) => {
    if (currentLeader == null) {
      currentLeader = item.user;
      return;
    }
    if (currentLeader.currentStreak < item.user.currentStreak) {
      currentLeader = item.user;
    }
  });

  return (
    <Paper elevation={3}>
      <div className="section">
        <p className="name">{leaderboard.name}</p>
        <p className="summonerNames">
          Members:{" "}
          {leaderboard.UserCustomLeaderboard.map((item, index) => {
            if (index == leaderboard.UserCustomLeaderboard.length - 1) {
              return item.user.name;
            }
            return item.user.name + ", ";
          })}
        </p>
        <p className="currentLeader">
          Current leader: <strong>{currentLeader?.name}</strong>. He/she has not
          played league for <strong>{currentLeader?.currentStreak}</strong>{" "}
          days.
        </p>

        <Link href={"/leaderboard/" + encodeURI(leaderboard.name)}>
          <Button
            color="default"
            style={{ marginBottom: 0, marginTop: 10 }}
            size="small"
            variant="outlined"
          >
            View Leaderboard
          </Button>
        </Link>
      </div>

      <style jsx>{`
        .section {
          padding: 10px;
          margin-bottom: 20px;
          background-color: #2b2b2b;
        }

        .name {
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 2px;
          font-weight: 400;
        }

        .streak {
          font-size: 28px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 0;
        }

        .summonerNames {
          margin: 0;
          padding: 0;
          color: #b1afaf;
          margin-top: 3px;
        }

        .currentLeader {
          margin: 0;
          padding: 0;
          margin-top: 5px;
          color: #b1afaf;
        }
      `}</style>
    </Paper>
  );
}

export default LeaderboardSummary;
