import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/projects")}>
        Projects
      </button>

      <button onClick={() => navigate("/users")}>
        Users
      </button>
    </div>
  );
}
