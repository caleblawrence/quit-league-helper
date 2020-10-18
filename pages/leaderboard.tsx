import Head from "next/head";
import React, { useState } from "react";

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container">
      <Head>
        <title>Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Leaderboard</h1>
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

export default Leaderboard;
