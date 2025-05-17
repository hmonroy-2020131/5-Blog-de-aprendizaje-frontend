import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, Spin, Alert, ConfigProvider, theme } from "antd";
import useComments from "../shared/hooks/useComments";
import { getPublicationById } from "../services/api.jsx";

import {
  PublicationHeader,
  CommentsList,
  AddCommentForm,
  HeaderWithDarkModeToggle,
} from "../components/publicationDetailsComponents.jsx";

const { Content } = Layout;

export const PublicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publication, setPublication] = useState(null);
  const [loadingPub, setLoadingPub] = useState(true);
  const [errorPub, setErrorPub] = useState(null);

  const { comments, loadingComments, errorComments, addComment, updateComment, deleteComment } =
    useComments(id);

  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchPublication = async () => {
      setLoadingPub(true);
      setErrorPub(null);
      try {
        const res = await getPublicationById(id);
        if (res.error) throw new Error(res.message || "Error al obtener publicación");
        setPublication(res.publication);
      } catch (err) {
        setErrorPub(err.message);
      } finally {
        setLoadingPub(false);
      }
    };
    fetchPublication();
  }, [id]);

  const handleAddComment = async () => {
    setAddError(null);

    if (!content.trim()) {
      setAddError("El contenido es obligatorio.");
      return;
    }

    setAdding(true);

    const res = await addComment(authorName.trim() === "" ? "Anonymous" : authorName, content);

    if (!res.success) {
      setAddError(res.message || "Error al agregar comentario");
    } else {
      setAuthorName("");
      setContent("");
    }

    setAdding(false);
  };

  return (
    <ConfigProvider
      theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: darkMode ? "#141414" : "#fff",
          padding: "24px 48px",
        }}
      >
        <Content
          style={{
            maxWidth: 900,
            margin: "auto",
            backgroundColor: darkMode ? "#1f1f1f" : "#fff",
            padding: 24,
            borderRadius: 8,
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <HeaderWithDarkModeToggle
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onBack={() => navigate(-1)}
          />

          {loadingPub ? (
            <Spin size="large" />
          ) : errorPub ? (
            <Alert message={errorPub} type="error" />
          ) : (
            <>
              <PublicationHeader publication={publication} darkMode={darkMode} />

              <CommentsList
                comments={comments}
                loadingComments={loadingComments}
                errorComments={errorComments}
                darkMode={darkMode}
                updateComment={updateComment}
                deleteComment={deleteComment}
              />

              <AddCommentForm
                authorName={authorName}
                setAuthorName={setAuthorName}
                content={content}
                setContent={setContent}
                adding={adding}
                addError={addError}
                setAddError={setAddError}
                handleAddComment={handleAddComment}
                darkMode={darkMode}
              />
            </>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
