import { useEffect, useState } from "react";
import { loginAdmin } from "../api/admin";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loginAdmin().then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Utilisateurs</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </div>
  );
}
