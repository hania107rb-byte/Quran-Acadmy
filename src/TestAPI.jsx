import { useEffect, useState } from "react";
import API from "./api/api";

function TestAPI() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    API.get("/users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.data);
        setMessage("Backend connected successfully!");
      })
      .catch((error) => {
        console.log(error);
        setMessage("Backend connection failed!");
      });
  }, []);

  return (
    <div>
      <h1>{message}</h1>

      <p>Total Users: {users.length}</p>
    </div>
  );
}

export default TestAPI;