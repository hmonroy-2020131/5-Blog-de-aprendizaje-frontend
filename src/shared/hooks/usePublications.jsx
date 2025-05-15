import { useState } from "react";
import apiClient from "../../services/api";

const usePublications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicationsByCourse = async (courseName) => {
    setLoading(true);
    setError(null);
    try {
      const url = courseName ? `/posts?course=${courseName}` : "/posts";
      const response = await apiClient.get(url);
      setPublications(response.data.posts || []);
    } catch (err) {
      setError("Error al obtener publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  return {
    publications,
    loading,
    error,
    fetchPublicationsByCourse,
  };
};

export default usePublications;
