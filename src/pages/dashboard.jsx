import React, { useEffect, useState, useMemo } from "react";
import usePublications from "../shared/hooks/usePublications";
import useCourses from "../shared/hooks/useCourses";
import {
  Layout,
  Select,
  Input,
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Tag,
  Pagination,
  Skeleton,
  Space,
  Alert,
  Switch,
  ConfigProvider,
  theme,
} from "antd";
import { BookOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const PAGE_SIZE = 6;

export const DashboardPage = () => {
  const { publications, loading, error, fetchPublicationsByCourse } = usePublications();
  const { courses, loadingCourses, errorCourses } = useCourses();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchPublicationsByCourse(selectedCourse);
    setCurrentPage(1);
  }, [selectedCourse, fetchPublicationsByCourse]);

  const filteredPubs = useMemo(() => {
    if (!searchTerm.trim()) return publications;
    const lowerSearch = searchTerm.toLowerCase();
    return publications.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerSearch) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch))
    );
  }, [publications, searchTerm]);

  const paginatedPubs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPubs.slice(start, start + PAGE_SIZE);
  }, [filteredPubs, currentPage]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header
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
              onChange={(checked) => setDarkMode(checked)}
              checkedChildren={<BulbFilled />}
              unCheckedChildren={<BulbOutlined />}
              aria-label="Toggle dark mode"
            />
          </Space>
        </Header>
        <Content style={{ padding: "24px 48px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row justify="center" gutter={16}>
              <Col xs={24} sm={12} md={8}>
                {loadingCourses ? (
                  <Skeleton.Input active size="large" style={{ width: "100%" }} />
                ) : errorCourses ? (
                  <Alert message={errorCourses} type="error" />
                ) : (
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
                    dropdownStyle={{ backgroundColor: darkMode ? "#141414" : undefined }}
                    popupClassName={darkMode ? "ant-select-dropdown-dark" : ""}
                  >
                    {courses.map((course) => (
                      <Option key={course._id} value={course.name}>
                        {course.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="Buscar en publicaciones"
                  allowClear
                  enterButton
                  size="large"
                  onSearch={(value) => setSearchTerm(value)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </Col>
            </Row>

            {loading ? (
              <Row gutter={[16, 16]}>
                {[...Array(PAGE_SIZE)].map((_, i) => (
                  <Col xs={24} sm={12} md={8} key={i}>
                    <Card loading style={{ height: 250 }} />
                  </Col>
                ))}
              </Row>
            ) : error ? (
              <Alert message={error} type="error" />
            ) : filteredPubs.length === 0 ? (
              <Text strong style={{ textAlign: "center", display: "block", marginTop: 50 }}>
                No se encontraron publicaciones
              </Text>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {paginatedPubs.map((pub) => (
                    <Col xs={24} sm={12} md={8} key={pub._id}>
                      <Card
                        hoverable
                        cover={
                          <div
                            style={{
                              height: 140,
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: 48,
                              fontWeight: "bold",
                              userSelect: "none",
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
                              <Paragraph ellipsis={{ rows: 3 }}>
                                {pub.description || "Sin descripción"}
                              </Paragraph>
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
                    pageSize={PAGE_SIZE}
                    total={filteredPubs.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper
                  />
                </Row>
              </>
            )}
          </Space>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
