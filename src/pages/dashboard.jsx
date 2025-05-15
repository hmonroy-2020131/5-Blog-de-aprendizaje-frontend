import React, { useEffect, useState } from "react";
import usePublications from "../shared/hooks/usePublications";

const cursos = [
  { id: "curso1", name: "Curso 1" },
  { id: "curso2", name: "Curso 2" },
  { id: "curso3", name: "Curso 3" },
];

export const DashboardPage = () => {
  const { publications, loading, error, fetchPublicationsByCourse } = usePublications();
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    fetchPublicationsByCourse(selectedCourse);
  }, [selectedCourse]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Dashboard de Publicaciones</h1>

      <div className="mb-4 d-flex justify-content-center">
        <select
          className="form-select w-auto"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Todos los cursos</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.name}>
              {curso.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status" aria-label="Loading"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          Error: {error}
        </div>
      )}

      {!loading && publications.length === 0 && (
        <p className="text-center">No hay publicaciones para mostrar.</p>
      )}

      <div className="row">
        {publications.map((pub) => (
          <div key={pub._id} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{pub.title}</h5>
                <p className="card-text text-truncate">{pub.description || "Sin descripción"}</p>
                <p className="card-text mt-auto">
                  <small className="text-muted">Curso: {pub.course?.name || "N/A"}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
