import axios from "axios";
import { formatRelative } from "date-fns";
import react, { useEffect, useState } from "react";
const MatchHistoryLastChecked = () => {
  const [lastChecked, setLastChecked] = useState("Loading...");

  useEffect(() => {
    async function getLastMatchHistoryCheck() {
      var response = await axios.get("/api/last-matchhistory-check");
      var lastMatchHistoryCheckDate = new Date(response.data.date);
      setLastChecked(formatRelative(lastMatchHistoryCheckDate, new Date()));
    }
    getLastMatchHistoryCheck();
  }, []);

  return (
    <p
      style={{
        color: "#b1afaf",
        margin: 0,
        padding: 0,
        marginBottom: 3,
        marginLeft: 5,
      }}
    >
      Last checked: {lastChecked}
    </p>
  );
};

export default MatchHistoryLastChecked;
