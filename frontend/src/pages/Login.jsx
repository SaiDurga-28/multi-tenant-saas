import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" />
      <input placeholder="Password" />
      <input placeholder="Tenant Subdomain" />
      <button onClick={() => navigate("/dashboard")}>
        Login
      </button>
    </div>
  );
}