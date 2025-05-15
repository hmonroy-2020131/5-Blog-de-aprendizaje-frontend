import { useState, useEffect } from "react";
import apiClient from "../../services/api"; 

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState(null);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setErrorCourses(null);
    try {
      const response = await apiClient.get("/courses");
      setCourses(response.data.courses || []);
    } catch (error) {
      setErrorCourses("Error al obtener cursos.");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loadingCourses, errorCourses };
};

export default useCourses;
