import React, { useEffect, useState } from "react";
import usePublications from "../shared/hooks/usePublications";
import useCourses from "../shared/hooks/useCourses";

export const DashboardPage = () => {
  const { publications, loading, error, fetchPublicationsByCourse } = usePublications();
  const { courses, loadingCourses, errorCourses } = useCourses();

  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    fetchPublicationsByCourse(selectedCourse);
  }, [selectedCourse, fetchPublicationsByCourse]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Dashboard de Publicaciones</h1>

      <div className="mb-4 d-flex justify-content-center">
        {loadingCourses ? (
          <div className="spinner-border" role="status" aria-label="Loading courses"></div>
        ) : errorCourses ? (
          <div className="alert alert-danger">{errorCourses}</div>
        ) : (
          <select
            className="form-select w-auto"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            aria-label="Filtro de cursos"
          >
            <option value="">Todos los cursos</option>
            {courses.map((course) => (
              <option key={course._id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status" aria-label="Loading publications"></div>
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
