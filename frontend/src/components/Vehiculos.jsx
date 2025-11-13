import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    patente: "",
    anio: "",
    capacidad_carga: "",
  });
  const [editId, setEditId] = useState(null);

  // =============================
  // CARGAR LISTA DE VEHÍCULOS
  // =============================
  const cargarVehiculos = async () => {
    try {
      const res = await api.get("/vehiculos");
      setVehiculos(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los vehículos", "error");
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  // =============================
  // MANEJO DE FORMULARIO
  // =============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // MODO EDICIÓN
        await api.put(`/vehiculos/${editId}`, form);
        Swal.fire("Actualizado", "Vehículo modificado correctamente", "success");
      } else {
        // MODO CREACIÓN
        await api.post("/vehiculos", form);
        Swal.fire("Agregado", "Vehículo registrado correctamente", "success");
      }
      setForm({
        marca: "",
        modelo: "",
        patente: "",
        anio: "",
        capacidad_carga: "",
      });
      setEditId(null);
      cargarVehiculos();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el vehículo", "error");
    }
  };

  // =============================
  // EDITAR VEHÍCULO
  // =============================
  const editarVehiculo = (vehiculo) => {
    setEditId(vehiculo.id);
    setForm({
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      patente: vehiculo.patente,
      anio: vehiculo.anio,
      capacidad_carga: vehiculo.capacidad_carga,
    });
  };

  // =============================
  // ELIMINAR VEHÍCULO
  // =============================
  const eliminarVehiculo = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar vehículo?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/vehiculos/${id}`);
        Swal.fire("Eliminado", "Vehículo borrado correctamente", "success");
        cargarVehiculos();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar el vehículo", "error");
      }
    }
  };

  return (
    <div className="page">
      <h2>Gestión de Vehículos</h2>

      {/* =============================
          FORMULARIO
      ============================= */}
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={form.marca}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          value={form.modelo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="patente"
          placeholder="Patente"
          value={form.patente}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="anio"
          placeholder="Año"
          value={form.anio}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="capacidad_carga"
          placeholder="Capacidad de carga (kg)"
          value={form.capacidad_carga}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
      </form>

      {/* =============================
          TABLA DE VEHÍCULOS
      ============================= */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.patente}</td>
              <td>{v.anio}</td>
              <td>{v.capacidad_carga}</td>
              <td>
                <button onClick={() => editarVehiculo(v)}>✏️</button>
                <button onClick={() => eliminarVehiculo(v.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
