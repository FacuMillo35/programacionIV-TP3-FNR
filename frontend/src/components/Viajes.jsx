import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

export default function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);

  const [form, setForm] = useState({
    vehiculo_id: "",
    conductor_id: "",
    fecha_salida: "",
    fecha_llegada: "",
    origen: "",
    destino: "",
    kilometros: "",
    observaciones: "",
  });

  const [editId, setEditId] = useState(null);

  // ====== FILTRO ======
  const [filtroVehiculo, setFiltroVehiculo] = useState("");
  const [filtroConductor, setFiltroConductor] = useState("");

  // ====================================
  // CARGAR DATOS INICIALES
  // ====================================
  const cargarTodo = async () => {
    try {
      const resViajes = await api.get("/viajes");
      const resVehiculos = await api.get("/vehiculos");
      const resConductores = await api.get("/conductores");

      setViajes(resViajes.data);
      setVehiculos(resVehiculos.data);
      setConductores(resConductores.data);
    } catch (err) {
      Swal.fire("Error", "No se pudo cargar la información", "error");
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // ====================================
  // MANEJO DE FORMULARIO
  // ====================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ====================================
  // CREAR / EDITAR
  // ====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/viajes/${editId}`, form);
        Swal.fire("Actualizado", "Viaje modificado correctamente", "success");
      } else {
        await api.post("/viajes", form);
        Swal.fire("Agregado", "Viaje registrado correctamente", "success");
      }

      // Reset form
      setForm({
        vehiculo_id: "",
        conductor_id: "",
        fecha_salida: "",
        fecha_llegada: "",
        origen: "",
        destino: "",
        kilometros: "",
        observaciones: "",
      });
      setEditId(null);
      cargarTodo();

    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el viaje", "error");
    }
  };

  // ====================================
  // EDITAR
  // ====================================
  const editarViaje = (v) => {
    setEditId(v.id);
    setForm({
      vehiculo_id: v.vehiculo_id,
      conductor_id: v.conductor_id,
      fecha_salida: v.fecha_salida.replace("Z", ""),
      fecha_llegada: v.fecha_llegada.replace("Z", ""),
      origen: v.origen,
      destino: v.destino,
      kilometros: v.kilometros,
      observaciones: v.observaciones || "",
    });
  };

  // ====================================
  // ELIMINAR
  // ====================================
  const eliminarViaje = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar viaje?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/viajes/${id}`);
        Swal.fire("Eliminado", "Viaje eliminado correctamente", "success");
        cargarTodo();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el viaje", "error");
      }
    }
  };

  // ====================================
  // FILTRADO
  // ====================================
  const viajesFiltrados = viajes.filter((v) => {
    let ok = true;

    if (filtroVehiculo !== "") ok = ok && v.vehiculo_id === Number(filtroVehiculo);
    if (filtroConductor !== "") ok = ok && v.conductor_id === Number(filtroConductor);

    return ok;
  });

  // Cálculo de km según filtro
  const kmTotalFiltrado = viajesFiltrados.reduce(
    (acc, v) => acc + Number(v.kilometros),
    0
  );

  const resetFiltros = () => {
    setFiltroVehiculo("");
    setFiltroConductor("");
  };

  return (
    <div className="page">
      <h2>Gestión de Viajes</h2>

      {/* ====================================
          FORMULARIO
      ==================================== */}
      <form onSubmit={handleSubmit} className="form-container">

        <select name="vehiculo_id" value={form.vehiculo_id} onChange={handleChange} required>
          <option value="">Seleccione vehículo</option>
          {vehiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} - {v.patente}
            </option>
          ))}
        </select>

        <select name="conductor_id" value={form.conductor_id} onChange={handleChange} required>
          <option value="">Seleccione conductor</option>
          {conductores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <input type="datetime-local" name="fecha_salida" value={form.fecha_salida} onChange={handleChange} required />
        <input type="datetime-local" name="fecha_llegada" value={form.fecha_llegada} onChange={handleChange} required />

        <input type="text" name="origen" placeholder="Origen" value={form.origen} onChange={handleChange} required />
        <input type="text" name="destino" placeholder="Destino" value={form.destino} onChange={handleChange} required />

        <input type="number" name="kilometros" placeholder="Kilómetros" value={form.kilometros} onChange={handleChange} required />

        <textarea name="observaciones" placeholder="Observaciones" value={form.observaciones} onChange={handleChange}></textarea>

        <button type="submit">{editId ? "Actualizar viaje" : "Registrar viaje"}</button>
      </form>

      {/* ====================================
          FILTROS
      ==================================== */}
      <h3>Historial de Viajes (Filtrar)</h3>

      <div className="form-container">

        <select value={filtroVehiculo} onChange={(e) => setFiltroVehiculo(e.target.value)}>
          <option value="">Filtrar por vehículo</option>
          {vehiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.marca} {v.modelo} - {v.patente}
            </option>
          ))}
        </select>

        <select value={filtroConductor} onChange={(e) => setFiltroConductor(e.target.value)}>
          <option value="">Filtrar por conductor</option>
          {conductores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </select>

        <button onClick={resetFiltros} style={{ background: "#555" }}>Limpiar filtros</button>
      </div>

      {/* MOSTRAR KM DEL FILTRO */}
      <p>
        <strong>Kilómetros totales según filtro:</strong> {kmTotalFiltrado} km
      </p>

      {/* ====================================
          TABLA DE VIAJES
      ==================================== */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo</th>
            <th>Conductor</th>
            <th>Salida</th>
            <th>Llegada</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Kilómetros</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {viajesFiltrados.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.vehiculo_marca} {v.vehiculo_modelo}</td>
              <td>{v.conductor_nombre} {v.conductor_apellido}</td>
              <td>{v.fecha_salida.replace("T", " ").slice(0, 16)}</td>
              <td>{v.fecha_llegada.replace("T", " ").slice(0, 16)}</td>
              <td>{v.origen}</td>
              <td>{v.destino}</td>
              <td>{v.kilometros}</td>

              <td>
                <button onClick={() => editarViaje(v)}>✏️</button>
                <button onClick={() => eliminarViaje(v.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
