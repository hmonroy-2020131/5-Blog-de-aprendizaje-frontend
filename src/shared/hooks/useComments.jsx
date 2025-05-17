import { useState, useEffect } from "react";
import apiClient from "../../services/api";

const useComments = (publicationId) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState(null);

  useEffect(() => {
    if (!publicationId) return;
    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const response = await apiClient.get(`/comments/post/${publicationId}`);
        setComments(
          (response.data.comments || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        setErrorComments("Error al obtener comentarios.");
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [publicationId]);

  const addComment = async (authorName, content) => {
    try {
      const response = await apiClient.post(`/comments/`, {
        post: publicationId,
        authorName: authorName.trim() === "" ? "Anonymous" : authorName,
        content,
      });
      setComments((prev) => [response.data.comment, ...prev]); // Añadir al inicio
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Error creando comentario",
      };
    }
  };

  const updateComment = async (commentId, authorName, content) => {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, {
        authorName: authorName.trim() === "" ? "Anonymous" : authorName,
        content,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? response.data.comment : c))
      );
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Error actualizando comentario",
      };
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Error eliminando comentario",
      };
    }
  };

  return {
    comments,
    loadingComments,
    errorComments,
    addComment,
    updateComment,
    deleteComment,
  };
};

export default useComments;
