import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav>
        <Link to="/vehiculos">Vehículos</Link>
        <Link to="/conductores">Conductores</Link>
        <Link to="/viajes">Viajes</Link>

        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
