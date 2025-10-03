import {
  Button,
  Col,
  Empty,
  Flex,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
  Input, // <-- 1. Import Input
} from "antd";
import MainLayout from "../../../components/layout/MainLayout";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useGetChaptersQuery } from "../../../service/api/lms/ApiChapter";
import History from "../attendance/History";
import Attitude from "./Attitude";
import { useGetStudentsInClassQuery } from "../../../service/api/main/ApiClass";
import Formative from "./Formative";
import Summative from "./Summative";

const { Search } = Input; // <-- 2. Destructure Search component

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const semesters = [
  { label: "Semester 1", value: 1 },
  { label: "Semester 2", value: 2 },
];

const TabScore = ({ name, id }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: chapterData, isLoading: isChapterLoading } =
    useGetChaptersQuery(id);

  // State untuk paginasi dan pencarian
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const semesterParam = searchParams.get("semester");
  const monthParam = searchParams.get("month");
  const chapterParam = searchParams.get("chapter");
  const classParam = searchParams.get("class");
  const subjectIdParam = searchParams.get("subjectid"); // Ambil subjectid dari URL

  const { data, isLoading } = useGetStudentsInClassQuery(
    { page, limit, search, classid: classParam },
    { skip: !classParam }
  );

  // Memoized options untuk Select components
  const monthOptions = useMemo(
    () => months.map((month) => ({ value: month, label: month })),
    []
  );
  const semesterOptions = useMemo(
    () => semesters.map((s) => ({ value: s.value, label: s.label })),
    []
  );
  const chapterOptions = useMemo(
    () =>
      chapterData?.map((c) => ({
        value: c.chapter_id,
        label: c.chapter_name,
      })) || [],
    [chapterData]
  );
  const classOptions = useMemo(() => {
    if (!chapterParam) return [];
    const selectedChapter = chapterData?.find(
      (c) => String(c.chapter_id) === String(chapterParam)
    );
    return (
      selectedChapter?.class?.map((cls) => ({
        value: cls.id,
        label: cls.name,
      })) || []
    );
  }, [chapterData, chapterParam]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key === "chapter") {
      newParams.delete("class");
    }

    // Reset paginasi saat filter berubah
    setPage(1);
    setSearchParams(newParams);
  };

  // Handler untuk pencarian
  const onSearch = (value) => {
    setSearch(value);
    setPage(1); // Reset ke halaman pertama setiap kali melakukan pencarian baru
  };

  const handleBack = () => navigate("/learning-management-system");

  const items = [
    {
      label: "Kehadiran",
      key: "1",
      children: <History classid={classParam} subjectid={subjectIdParam} />, // Gunakan subjectIdParam
    },
    {
      label: "Sikap",
      key: "2",
      children: (
        // 3. Teruskan semua state dan handler yang dibutuhkan ke Attitude
        <Attitude
          students={data?.students}
          totalData={data?.totalData} // Sesuaikan dengan respons API Anda
          page={page}
          limit={limit}
          search={search}
          setPage={setPage}
          setLimit={setLimit}
          setSearch={setSearch}
          isLoading={isLoading} // Teruskan status loading
        />
      ),
    },
    {
      label: "Formatif",
      key: "3",
      children: (
        <Formative
          students={data?.students}
          totalData={data?.totalData} // Sesuaikan dengan respons API Anda
          page={page}
          limit={limit}
          search={search}
          setPage={setPage}
          setLimit={setLimit}
          setSearch={setSearch}
          isLoading={isLoading}
        />
      ),
    },
    {
      label: "Sumatif",
      key: "4",
      children: (
        <Summative
          students={data?.students}
          totalData={data?.totalData} // Sesuaikan dengan respons API Anda
          page={page}
          limit={limit}
          search={search}
          setPage={setPage}
          setLimit={setLimit}
          setSearch={setSearch}
          isLoading={isLoading}
        />
      ),
    },
    { label: "Rekap", key: "5" },
  ];

  const isAllFilterSelected =
    semesterParam && monthParam && chapterParam && classParam;

  return (
    <MainLayout
      title={`Pelajaran ${name.replace(/-/g, " ")}`}
      levels={["teacher"]}
    >
      <Flex vertical gap={"middle"}>
        <Space>
          <Button
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          />
          <Typography.Title style={{ margin: 0 }} level={5}>
            {`Penilaian ${name.replace(/-/g, " ")}`}
          </Typography.Title>
        </Space>

        <Row gutter={[10, 10]}>
          <Col sm={24} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Pilih Semester"
              options={semesterOptions}
              allowClear
              value={semesterParam ? Number(semesterParam) : null}
              onChange={(v) => handleFilterChange("semester", v)}
            />
          </Col>
          <Col sm={24} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Pilih Bulan"
              options={monthOptions}
              allowClear
              value={monthParam}
              onChange={(v) => handleFilterChange("month", v)}
            />
          </Col>
          <Col sm={24} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Pilih Chapter"
              options={chapterOptions}
              allowClear
              loading={isChapterLoading}
              value={chapterParam ? Number(chapterParam) : null}
              onChange={(v) => handleFilterChange("chapter", v)}
            />
          </Col>
          <Col sm={24} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Pilih Kelas"
              options={classOptions}
              allowClear
              disabled={!chapterParam}
              value={classParam ? Number(classParam) : null}
              onChange={(v) => handleFilterChange("class", v)}
            />
          </Col>
        </Row>

        {isAllFilterSelected ? (
          <>
            {/* 4. Tambahkan Input Search di sini */}
            <Search
              placeholder="Cari nama siswa..."
              onSearch={onSearch}
              enterButton
              allowClear
            />
            <Tabs centered items={items} />
          </>
        ) : (
          <Empty description="Pilih Semester, bulan, chapter dan kelas terlebih dahulu" />
        )}
      </Flex>
    </MainLayout>
  );
};

export default TabScore;
