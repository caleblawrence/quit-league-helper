import Head from "next/head";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

function BuildCustomLeaderboard() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summonerNames, setSummonerNames] = useState([""]);
  const [summonerNamesNotFound, setSummonerNamesNotFound] = useState([]);

  const handleCreateButtonPress = async () => {
    setIsLoading(true);
    const summonerNamesToUse = summonerNames.filter((x) => x.trim() != "");
    try {
      const response = await axios.post("/api/leaderboard", {
        name,
        summonerNames: summonerNamesToUse,
      });
      setSummonerNamesNotFound([]);

      window.location.href = "/leaderboard/" + encodeURI(name);
    } catch (error) {
      console.error(error.response);
      if (error.response.data.summonerNamesNotFound) {
        setSummonerNamesNotFound(error.response.data.summonerNamesNotFound);
      }
    }

    setIsLoading(false);
  };

  const handleAddUser = () => {
    setSummonerNames((summonerNames) => [...summonerNames, ""]);
  };

  const handleSummonerNameChange = (i: number, summonerName: string) => {
    let newSummerNames = [...summonerNames];
    newSummerNames[i] = summonerName;
    setSummonerNames(newSummerNames);
  };

  return (
    <div className="container">
      <Head>
        <title>Build a Custom Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle" style={{ marginBottom: 20 }}>
          Build a custom leaderboard
        </h1>
        <TextField
          id="outlined-basic"
          label="Leaderboard name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          style={{ maxWidth: 800 }}
        />
        <p style={{ marginBottom: 0 }}>
          You can add people to this board by entering in one of their summoner
          names they signed up with (eg. their main account).
        </p>
        {summonerNames.map((summonerName, i) => (
          <TextField
            label="Users summoner name"
            variant="outlined"
            value={summonerName}
            onChange={(e) => handleSummonerNameChange(i, e.target.value)}
            fullWidth
            style={{ maxWidth: 800, marginTop: 20 }}
            key={i}
          />
        ))}
        <Button
          color="primary"
          onClick={handleAddUser}
          style={{ marginBottom: 0, display: "block" }}
        >
          Add another user
        </Button>

        {summonerNamesNotFound.length > 0 && (
          <Alert severity="error" style={{ backgroundColor: "rgb(37 11 10)" }}>
            <AlertTitle>
              Could not find users that signed up the following summoner names:
            </AlertTitle>
            {summonerNamesNotFound.map((name) => (
              <p>{name}</p>
            ))}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: 15 }}
          onClick={handleCreateButtonPress}
          disabled={
            summonerNames.filter((x) => x.trim() != "").length === 0 ||
            name === ""
          }
        >
          {isLoading ? "Loading..." : "Create board"}
        </Button>
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

export default BuildCustomLeaderboard;
