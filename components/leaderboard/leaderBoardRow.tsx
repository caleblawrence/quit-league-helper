import { Paper } from "@material-ui/core";
import { User } from "@prisma/client";
import Head from "next/head";
import React from "react";

interface Props {
  user: User;
}
export default function LeaderBoardRow(props: Props) {
  const { user } = props;

  return (
    <Paper elevation={3}>
      <div className="section">
        <p className="name">{user.name}</p>
        <p className="streak">
          {user.currentStreak} {user.currentStreak > 0 ? "day" : "days"}{" "}
          <span style={{ color: "#b9b3b3", fontSize: 20 }}>
            since last game of League of Legends
          </span>
        </p>
        <p className="summonerNames">
          {user.summonerNames.map((name, index) => {
            if (index == user.summonerNames.length - 1) {
              return name;
            }
            return name + ", ";
          })}
        </p>
        <p
          className="longestStreak"
          style={{ margin: 0, padding: 0, marginTop: 5, color: "#b1afaf" }}
        >
          Longest streak: <strong>{user.longestStreak}</strong>
        </p>
      </div>

      <style jsx>{`
        .section {
          padding: 10px;
          margin-bottom: 20px;
          background-color: #2b2b2b;
        }

        .name {
          font-size: 18px;
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
        }
      `}</style>
    </Paper>
  );
}
