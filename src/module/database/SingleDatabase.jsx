import { useSearchParams } from "react-router-dom";
import { useGetStudentDataQuery } from "../../service/api/database/ApiDatabase";
import { Skeleton, Tabs } from "antd";
import PersonalData from "./PersonalData";
import ParentData from "./ParentData";
import FamilyData from "./FamilyData";
import { Fragment } from "react";
import Title from "antd/es/typography/Title";

const SingleDatabase = ({ formInput, studentid, nis, name }) => {
  // Mengambil data siswa berdasarkan studentid
  const { data, isLoading, isError } = useGetStudentDataQuery(studentid);

  // Menampilkan skeleton loading saat data sedang diambil
  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (isError) {
    return <Title level={5}>Gagal memuat data siswa.</Title>;
  }

  // Definisikan item untuk Tabs
  // Label 'Biodata' kedua diubah menjadi 'Keluarga' agar tidak duplikat
  const items = [
    {
      label: "Biodata Siswa",
      key: "1",
      // Teruskan data siswa ke komponen PersonalData
      children: <PersonalData studentData={data?.data} />,
    },
    {
      label: "Data Orang Tua",
      key: "2",
      // Teruskan data siswa ke komponen ParentData
      children: <ParentData studentData={data?.data} />,
    },
    {
      label: "Data Keluarga",
      key: "3",
      // Teruskan array 'family' ke komponen FamilyData
      children: <FamilyData familyData={data?.data?.family} />,
    },
  ];

  return (
    <Fragment>
      <title>{`Data Siswa ${name?.replace(/-/g, " ")}`}</title>
      <Tabs defaultActiveKey='1' centered items={items} />
    </Fragment>
  );
};

export default SingleDatabase;
