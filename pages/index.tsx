import Head from "next/head";
import React, { useState } from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Alert, AlertTitle } from "@material-ui/lab";
import ButtonAppBar from "../components/appBar";

const Home = () => {
  const [name, setName] = useState("");
  const [summonerNames, setSummonerNames] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidSummonerNames, setInvalidSummonerNames] = useState([]);

  const handleSummonerNameChange = (i: number, summonerName: string) => {
    let newSummerNames = [...summonerNames];
    newSummerNames[i] = summonerName;
    setSummonerNames(newSummerNames);
  };

  const handleAddAccount = () => {
    setSummonerNames((summonerNames) => [...summonerNames, ""]);
  };

  const handleSignupPress = async () => {
    setIsLoading(true);
    const summonerNamesToUse = summonerNames.filter((x) => x.trim() != "");
    try {
      const response = await axios.post("/api/signup", {
        name,
        summonerNames: summonerNamesToUse,
      });
      setInvalidSummonerNames([]);
      window.location.href = "/leaderboard";
    } catch (error) {
      console.error(error.response);
      if (error.response.data.invalidSummonerNames) {
        setInvalidSummonerNames(error.response.data.invalidSummonerNames);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <Head>
        <title>Quit League</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Want to take a break from</h1>
        <h1 className="LoL">League of Legends?</h1>
        <h2>
          We can help you. Fill out the form below and we will keep track of
          your streak automatically.
        </h2>

        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-hourly">Your Name</InputLabel>
          <OutlinedInput
            id="outlined-adornment-hourly"
            value={name}
            onChange={(e) => setName(e.target.value)}
            labelWidth={77}
          />
        </FormControl>

        {summonerNames.map((summonerName, i) => (
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginTop: 20 }}
            key={i}
          >
            <InputLabel htmlFor="outlined-adornment-annual">
              Summoner Name
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-annual"
              value={summonerName}
              onChange={(e) => handleSummonerNameChange(i, e.target.value)}
              labelWidth={125}
            />
          </FormControl>
        ))}
        <Button
          color="primary"
          onClick={handleAddAccount}
          style={{ marginBottom: 0, paddingBottom: 0 }}
        >
          Add another account
        </Button>

        <p style={{ color: "#797272", marginTop: 8, paddingTop: 0 }}>
          Be sure to include all your accounts.
        </p>

        {invalidSummonerNames.length > 0 && (
          <Alert severity="error">
            <AlertTitle>Invalid Summoner Names</AlertTitle>
            {invalidSummonerNames.map((name) => (
              <p>{name}</p>
            ))}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: 15 }}
          onClick={handleSignupPress}
        >
          {isLoading ? "Loading..." : "Take a break"}
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

        h1 {
          font-size: 50px;
          margin-bottom: 0;
          padding-bottom: 0;
          font-weight: 400;
        }

        .LoL {
          font-size: 70px;
          margin-top: 0;
          padding-top: 0;
          margin-bottom: 40px;
          font-weight: 600;
        }

        h2 {
          font-size: 20px;
          font-weight: ;
        }

        @media only screen and (max-width: 600px) {
          h1 {
            font-size: 40px;
          }
          .LoL {
            font-size: 50px;
          }
        }

        a {
          color: white;
          text-decoration: none !important; /* no underline */
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          background-color: #121212 !important;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
