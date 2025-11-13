import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    lic_vencimiento: "",
  });
  const [editId, setEditId] = useState(null);

  // =============================
  // CARGAR LISTA DE CONDUCTORES
  // =============================
  const cargarConductores = async () => {
    try {
      const res = await api.get("/conductores");
      setConductores(res.data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los conductores", "error");
    }
  };

  useEffect(() => {
    cargarConductores();
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
        await api.put(`/conductores/${editId}`, form);
        Swal.fire("Actualizado", "Conductor modificado correctamente", "success");
      } else {
        await api.post("/conductores", form);
        Swal.fire("Agregado", "Conductor registrado correctamente", "success");
      }

      // Resetear formulario
      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        licencia: "",
        lic_vencimiento: "",
      });
      setEditId(null);
      cargarConductores();

    } catch (err) {
      Swal.fire("Error", "No se pudo guardar el conductor", "error");
    }
  };

  // =============================
  // EDITAR
  // =============================
  const editarConductor = (conductor) => {
    setEditId(conductor.id);
    setForm({
      nombre: conductor.nombre,
      apellido: conductor.apellido,
      dni: conductor.dni,
      licencia: conductor.licencia,
      lic_vencimiento: conductor.lic_vencimiento.split("T")[0], // formato yyyy-mm-dd
    });
  };

  // =============================
  // ELIMINAR
  // =============================
  const eliminarConductor = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar conductor?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/conductores/${id}`);
        Swal.fire("Eliminado", "Conductor borrado correctamente", "success");
        cargarConductores();
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el conductor", "error");
      }
    }
  };

  return (
    <div className="page">
      <h2>Gestión de Conductores</h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="licencia"
          placeholder="Licencia"
          value={form.licencia}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="lic_vencimiento"
          value={form.lic_vencimiento}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* TABLA */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Licencia</th>
            <th>Vencimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.dni}</td>
              <td>{c.licencia}</td>
              <td>{c.lic_vencimiento.split("T")[0]}</td>

              <td>
                <button onClick={() => editarConductor(c)}>✏️</button>
                <button onClick={() => eliminarConductor(c.id)}>🗑️</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
