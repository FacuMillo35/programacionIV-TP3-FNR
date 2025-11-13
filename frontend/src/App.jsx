import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Vehiculos from "./components/Vehiculos";
import Conductores from "./components/Conductores";
import Viajes from "./components/Viajes";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: "#0077cc", padding: "10px" }}>
        <Link to="/" style={{ color: "white", marginRight: "10px" }}>Inicio</Link>
        <Link to="/registro" style={{ color: "white", marginRight: "10px" }}>Registro</Link>
        <Link to="/vehiculos" style={{ color: "white", marginRight: "10px" }}>Vehículos</Link>
        <Link to="/conductores" style={{ color: "white", marginRight: "10px" }}>Conductores</Link>
        <Link to="/viajes" style={{ color: "white" }}>Viajes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/conductores" element={<Conductores />} />
        <Route path="/viajes" element={<Viajes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
