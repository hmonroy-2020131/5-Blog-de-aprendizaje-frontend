import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import usePublications from "../shared/hooks/usePublications";
import useCourses from "../shared/hooks/useCourses";
import { Layout, Space, ConfigProvider, theme, Row, Col } from "antd";

import {
  HeaderDashboard,
  FilterCourses,
  SearchPublications,
  PublicationsList,
} from "../components/dashboardComponents.jsx";

const { Content } = Layout;
const PAGE_SIZE = 6;

export const DashboardPage = () => {
  const navigate = useNavigate();

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
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: "100vh" }}>
        <HeaderDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
        <Content style={{ padding: "24px 48px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row justify="center" gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <FilterCourses
                  darkMode={darkMode}
                  loadingCourses={loadingCourses}
                  errorCourses={errorCourses}
                  courses={courses}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <SearchPublications searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </Col>
            </Row>

            <PublicationsList
              darkMode={darkMode}
              publications={publications}
              paginatedPubs={paginatedPubs}
              loading={loading}
              error={error}
              filteredPubs={filteredPubs}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              navigate={navigate}
            />
          </Space>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};
