
import React from "react";
import { Typography, Space, Switch, Select, Skeleton, Alert, Input, Card, Row, Col, Tooltip, Tag, Pagination } from "antd";
import { BulbOutlined, BulbFilled, BookOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

export const HeaderDashboard = ({ darkMode, setDarkMode }) => (
  <header
    style={{
      backgroundColor: darkMode ? "#001529" : "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
    }}
  >
    <Title
      level={3}
      style={{ color: darkMode ? "#fff" : "#000", margin: 0, lineHeight: "64px" }}
    >
      Publicaciones
    </Title>
    <Space>
      <BulbOutlined style={{ color: darkMode ? "#fff" : "#000" }} />
      <Switch
        checked={darkMode}
        onChange={setDarkMode}
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        aria-label="Toggle dark mode"
      />
    </Space>
  </header>
);

export const FilterCourses = ({
  darkMode,
  loadingCourses,
  errorCourses,
  courses,
  selectedCourse,
  setSelectedCourse,
}) => {
  if (loadingCourses) return <Skeleton.Input active size="large" style={{ width: "100%" }} />;
  if (errorCourses) return <Alert message={errorCourses} type="error" />;

  return (
    <Select
      showSearch
      allowClear
      placeholder="Filtrar por curso"
      optionFilterProp="children"
      onChange={(value) => setSelectedCourse(value || "")}
      value={selectedCourse || undefined}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      style={{ width: "100%" }}
      suffixIcon={<BookOutlined />}
      styles={{
        popup: {
          root: {
            backgroundColor: darkMode ? "#141414" : undefined,
          },
        },
      }}
      popupClassName={darkMode ? "ant-select-dropdown-dark" : ""}
    >
      {courses.map((course) => (
        <Option key={course._id} value={course.name}>
          {course.name}
        </Option>
      ))}
    </Select>
  );
};

export const SearchPublications = ({ searchTerm, setSearchTerm }) => (
  <Search
    placeholder="Buscar en publicaciones"
    allowClear
    enterButton
    size="large"
    onSearch={(value) => setSearchTerm(value)}
    onChange={(e) => setSearchTerm(e.target.value)}
    value={searchTerm}
  />
);

export const PublicationsList = ({
  darkMode,
  publications,
  paginatedPubs,
  loading,
  error,
  filteredPubs,
  currentPage,
  setCurrentPage,
  navigate,
}) => {
  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {[...Array(6)].map((_, i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Card loading style={{ height: 250 }} />
          </Col>
        ))}
      </Row>
    );
  }

  if (error)
    return <Alert message={error} type="error" style={{ marginTop: 24, textAlign: "center" }} />;

  if (filteredPubs.length === 0)
    return (
      <Text strong style={{ textAlign: "center", display: "block", marginTop: 50 }}>
        No se encontraron publicaciones
      </Text>
    );

  return (
    <>
      <Row gutter={[16, 16]}>
        {paginatedPubs.map((pub) => (
          <Col xs={24} sm={12} md={8} key={pub._id}>
            <Card
              hoverable
              onClick={() => navigate(`/publication/${pub._id}`)}
              cover={
                <div
                  style={{
                    height: 140,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 48,
                    fontWeight: "bold",
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                  aria-label="Imagen simulada"
                >
                  {pub.title[0].toUpperCase()}
                </div>
              }
            >
              <Card.Meta
                title={
                  <Tooltip title={`Curso: ${pub.course?.name || "N/A"}`}>
                    <Text strong>{pub.title}</Text>
                  </Tooltip>
                }
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 3 }}>{pub.description || "Sin descripción"}</Paragraph>
                    <Tag color="blue">{pub.course?.name || "Sin curso"}</Tag>
                    <Tag color="green">Activo</Tag>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: 24 }}>
        <Pagination
          current={currentPage}
          pageSize={6}
          total={filteredPubs.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          showQuickJumper
        />
      </Row>
    </>
  );
};
