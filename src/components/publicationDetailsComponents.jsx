import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  Space,
  Tooltip,
  Tag,
  Input,
  Row,
  Col,
  Alert,
  Button,
  Switch,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  SendOutlined,
  BulbOutlined,
  BulbFilled,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";


const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export const PublicationHeader = ({ publication, darkMode }) => (
  <Card
    variant="default"
    styles={{
      header: {
        borderBottom: "1px solid #eee",
        color: darkMode ? "#fff" : undefined,
      },
    }}
    style={{ marginBottom: 32, backgroundColor: darkMode ? "#1f1f1f" : undefined }}
  >
    <Space direction="vertical" size={0}>
      <Title level={2} style={{ marginBottom: 0, color: darkMode ? "#fff" : undefined }}>
        {publication.title}
      </Title>
      <Tooltip title={`Curso: ${publication.course?.name || "N/A"}`}>
        <Tag color="blue">{publication.course?.name || "Sin curso"}</Tag>
      </Tooltip>
    </Space>
    <Paragraph
      style={{
        fontSize: 16,
        lineHeight: 1.6,
        color: darkMode ? "#ddd" : undefined,
        marginTop: 16,
      }}
    >
      {publication.description || "Sin descripción disponible."}
    </Paragraph>
  </Card>
);

export const EditableComment = ({ comment, darkMode, updateComment, deleteComment }) => {
  const [editing, setEditing] = useState(false);
  const [authorName, setAuthorName] = useState(comment.authorName);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    const res = await updateComment(comment._id, authorName, content);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    } else {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    const res = await deleteComment(comment._id);
    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  if (editing) {
    return (
      <List.Item
        style={{
          padding: "12px 24px",
          borderRadius: 6,
          backgroundColor: darkMode ? "#222" : "#fafafa",
          marginBottom: 12,
          color: darkMode ? "#fff" : undefined,
        }}
      >
        {error && <Alert message={error} type="error" style={{ marginBottom: 8 }} />}
        <Input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          disabled={loading}
          placeholder="Nombre"
          style={{ marginBottom: 8 }}
        />
        <TextArea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          placeholder="Contenido"
          style={{ marginBottom: 8 }}
        />
        <Space>
          <Button
            icon={<CheckOutlined />}
            type="primary"
            onClick={handleSave}
            loading={loading}
          >
            Guardar
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={() => setEditing(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
        </Space>
      </List.Item>
    );
  }

  return (
    <List.Item
      style={{
        padding: "12px 24px",
        borderRadius: 6,
        backgroundColor: darkMode ? "#222" : "#fafafa",
        marginBottom: 12,
        color: darkMode ? "#fff" : undefined,
      }}
      actions={[
        <Button
          key="edit"
          icon={<EditOutlined />}
          onClick={() => setEditing(true)}
          type="link"
          style={{ color: darkMode ? "#40a9ff" : undefined }}
        />,
        <Popconfirm
          key="delete"
          title="¿Seguro que quieres eliminar este comentario?"
          onConfirm={handleDelete}
          okText="Sí"
          cancelText="No"
        >
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            style={{ color: darkMode ? "#ff4d4f" : undefined }}
          />
        </Popconfirm>,
      ]}
    >
      <List.Item.Meta
        title={<Text strong style={{ color: darkMode ? "#fff" : undefined }}>{comment.authorName}</Text>}
        description={<Text type="secondary">{new Date(comment.createdAt).toLocaleString()}</Text>}
      />
      <Paragraph style={{ marginTop: 8, fontSize: 15, color: darkMode ? "#ddd" : undefined }}>
        {comment.content}
      </Paragraph>
    </List.Item>
  );
};

export const CommentsList = ({
  comments,
  loadingComments,
  errorComments,
  darkMode,
  updateComment,
  deleteComment,
}) => {
  if (loadingComments) return <div style={{ textAlign: "center" }}>Cargando comentarios...</div>;
  if (errorComments) return <Alert message={errorComments} type="error" />;

  return (
    <List
      itemLayout="vertical"
      dataSource={comments}
      locale={{ emptyText: "No hay comentarios" }}
      style={{ marginBottom: 32 }}
      renderItem={(comment) => (
        <EditableComment
          key={comment._id}
          comment={comment}
          darkMode={darkMode}
          updateComment={updateComment}
          deleteComment={deleteComment}
        />
      )}
    />
  );
};

export const AddCommentForm = ({
  authorName,
  setAuthorName,
  content,
  setContent,
  adding,
  addError,
  setAddError,
  handleAddComment,
  darkMode,
}) => (
  <>
    <Title level={5} style={{ color: darkMode ? "#fff" : undefined }}>
      Agregar Comentario
    </Title>

    {addError && (
      <Alert
        type="error"
        message={addError}
        style={{ marginBottom: 16, borderRadius: 6 }}
        closable
        onClose={() => setAddError(null)}
      />
    )}

    <Row gutter={16}>
      <Col xs={24} sm={8}>
        <Input
          prefix={<UserOutlined />}
          placeholder="Tu nombre"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          disabled={adding}
          size="large"
          style={{
            backgroundColor: darkMode ? "#1f1f1f" : undefined,
            color: darkMode ? "#fff" : undefined,
          }}
        />
      </Col>
      <Col xs={24} sm={16}>
        <TextArea
          rows={3}
          placeholder="Escribe tu comentario aquí..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={adding}
          size="large"
          style={{
            backgroundColor: darkMode ? "#1f1f1f" : undefined,
            color: darkMode ? "#fff" : undefined,
          }}
        />
      </Col>
    </Row>

    <Button
      type="primary"
      icon={<SendOutlined />}
      onClick={handleAddComment}
      loading={adding}
      style={{ marginTop: 16, float: "right" }}
      disabled={adding}
    >
      Enviar Comentario
    </Button>
  </>
);

export const HeaderWithDarkModeToggle = ({ darkMode, setDarkMode, onBack }) => (
  <Space style={{ marginBottom: 24, justifyContent: "space-between", width: "100%" }}>
    <Button
      type="link"
      icon={<ArrowLeftOutlined />}
      onClick={onBack}
      style={{ fontSize: 16, color: darkMode ? "#fff" : "#000" }}
    >
      Regresar
    </Button>
    <Space align="center">
      <BulbOutlined style={{ color: darkMode ? "#fff" : "#000" }} />
      <Switch
        checked={darkMode}
        onChange={setDarkMode}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        aria-label="Toggle dark mode"
      />
    </Space>
  </Space>
);
