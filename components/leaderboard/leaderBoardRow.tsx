import { Paper } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import { User } from "../../types/User";

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
          {user.currentSreak} {user.currentSreak > 0 ? "day" : "days"}{" "}
          <span style={{ color: "#b9b3b3", fontSize: 20 }}>
            since last game of League of Legends
          </span>
        </p>
        <p className="summonerNames">
          {user.summonerNames.map((name) => name + ", ")}
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
