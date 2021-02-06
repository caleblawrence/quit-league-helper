import Head from "next/head";
import React, { useState } from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Alert, AlertTitle } from "@material-ui/lab";
import ButtonAppBar from "../components/appBar";
import MatchHistoryLastChecked from "../components/matchhistoryLastChecked";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const checkMatchHistory = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      await axios.get("/api/check-user-matchhistory");
      setIsLoading(false);
    } catch (ex) {
      setIsLoading(false);
      setIsError(true);
    }
  };
  return (
    <div className="container">
      <Head>
        <title>Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sectionTitle">Admin</h1>
        <MatchHistoryLastChecked />

        <Button
          onClick={checkMatchHistory}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Check match history"}
        </Button>

        {isError && <p>Error checking mastch history</p>}
      </main>

      <style jsx>{`
        .sectionTitle {
          font-size: 50px;
          margin-bottom: 5px;
        }
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
            font-size: 30px;
          }
          .LoL {
            font-size: 40px;
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
          background-color: rgba(0, 0, 0, 1) !important;
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

export default Admin;
