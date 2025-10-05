import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  DatePicker,
  InputNumber,
  message,
  Typography,
  Space,
  Spin,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useGetProvinceQuery,
  useGetCityQuery,
  useGetDistrictQuery,
  useGetVillageQuery,
} from "../../service/api/database/ApiArea";
import {
  useAddStudentDataMutation, // Asumsikan ini untuk update juga
  useGetPeriodeQuery,
  useGetHomebaseQuery,
} from "../../service/api/database/ApiDatabase";
import dayjs from "dayjs";

const { Title } = Typography;

const PersonalData = ({ studentData, onRefetch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState(
    studentData?.provinceid
  );
  const [selectedCity, setSelectedCity] = useState(studentData?.cityid);
  const [selectedDistrict, setSelectedDistrict] = useState(
    studentData?.districtid
  );

  // ** Mengambil data untuk dropdown **
  const { data: periodeData, isLoading: isPeriodeLoading } =
    useGetPeriodeQuery();
  const { data: homebaseData, isLoading: isHomebaseLoading } =
    useGetHomebaseQuery();
  const { data: provinces, isLoading: isProvinceLoading } =
    useGetProvinceQuery();
  const { data: cities, isLoading: isCityLoading } = useGetCityQuery(
    selectedProvince,
    { skip: !selectedProvince }
  );
  const { data: districts, isLoading: isDistrictLoading } = useGetDistrictQuery(
    selectedCity,
    { skip: !selectedCity }
  );
  const { data: villages, isLoading: isVillageLoading } = useGetVillageQuery(
    selectedDistrict,
    { skip: !selectedDistrict }
  );

  const [addStudentData, { isLoading: isUpdating }] =
    useAddStudentDataMutation();

  // ** Mengisi form dengan data awal **
  useEffect(() => {
    if (studentData) {
      form.setFieldsValue({
        ...studentData,
        birth_date: studentData.birth_date
          ? dayjs(studentData.birth_date)
          : null,
        villageid: studentData.villageid?.trim(), // Pastikan villageid di-trim
      });
      // Set state awal untuk dropdown wilayah
      setSelectedProvince(studentData.provinceid);
      setSelectedCity(studentData.cityid);
      setSelectedDistrict(studentData.districtid);
    }
  }, [studentData]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form ke nilai awal jika dibatalkan
    form.resetFields();
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      userid: studentData.userid,
      birth_date: values.birth_date
        ? dayjs(values.birth_date).format("YYYY-MM-DD")
        : null,
    };
    console.log("Data yang akan disimpan:", payload);

    try {
      await addStudentData(payload).unwrap();
      message.success("Data siswa berhasil diperbarui!");
      setIsEditing(false);
      if (onRefetch) onRefetch(); // Panggil refetch jika ada
    } catch (error) {
      message.error(error.data?.message || "Gagal memperbarui data.");
    }
  };

  // ** Menangani perubahan pada dropdown wilayah **
  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.provinceid) {
      setSelectedProvince(changedValues.provinceid);
      setSelectedCity(null);
      setSelectedDistrict(null);
      form.setFieldsValue({ cityid: null, districtid: null, villageid: null });
    }
    if (changedValues.cityid) {
      setSelectedCity(changedValues.cityid);
      setSelectedDistrict(null);
      form.setFieldsValue({ districtid: null, villageid: null });
    }
    if (changedValues.districtid) {
      setSelectedDistrict(changedValues.districtid);
      form.setFieldsValue({ villageid: null });
    }
  };

  // ** Opsi untuk Select (Dropdown) **
  const mapToOptions = (data) =>
    data?.map((item) => ({
      value: item.id.toString().trim(), // Trim ID untuk village
      label: item.name,
    })) || [];

  // ** Tampilan Mode Lihat **
  const renderViewMode = () => (
    <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} layout='vertical'>
      <Descriptions.Item label='Tahun Pelajaran'>
        {studentData?.entry_name}
      </Descriptions.Item>
      <Descriptions.Item label='Satuan Pendidikan'>
        {studentData?.homebase_name}
      </Descriptions.Item>
      <Descriptions.Item label='Nama Lengkap'>
        {studentData?.name}
      </Descriptions.Item>
      <Descriptions.Item label='Jenis Kelamin'>
        {studentData?.gender === "P" ? "Perempuan" : "Laki-laki"}
      </Descriptions.Item>
      <Descriptions.Item label='NIS'>{studentData?.nis}</Descriptions.Item>
      <Descriptions.Item label='NISN'>{studentData?.nisn}</Descriptions.Item>
      <Descriptions.Item label='Tempat & Tanggal Lahir'>{`${
        studentData?.birth_place
      }, ${dayjs(studentData?.birth_date).format(
        "DD MMMM YYYY"
      )}`}</Descriptions.Item>
      <Descriptions.Item label='Anak Ke / Dari Bersaudara'>{`${
        studentData?.order_number || "-"
      } / ${studentData?.siblings || "-"} bersaudara`}</Descriptions.Item>
      <Descriptions.Item label='Tinggi / Berat / Kepala'>{`${
        studentData?.height || "-"
      } cm / ${studentData?.weight || "-"} kg / ${
        studentData?.head || "-"
      } cm`}</Descriptions.Item>
      <Descriptions.Item label='Alamat' span={2}>
        {`${studentData?.address}, ${studentData?.village_name}, ${
          studentData?.district_name
        }, ${studentData?.city_name}, ${studentData?.province_name} ${
          studentData?.postal_code || ""
        }`}
      </Descriptions.Item>
    </Descriptions>
  );

  // ** Tampilan Mode Edit (Form) **
  const renderEditMode = () => (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
    >
      <Row gutter={[16, 0]}>
        {/* Data Pendidikan */}
        <Col xs={24} md={12}>
          <Form.Item
            name='entryid'
            label='Tahun Pelajaran'
            rules={[{ required: true }]}
          >
            <Select
              loading={isPeriodeLoading}
              options={mapToOptions(periodeData)}
              placeholder='Pilih Tahun Pelajaran'
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name='homebaseid'
            label='Satuan Pendidikan'
            rules={[{ required: true }]}
          >
            <Select
              loading={isHomebaseLoading}
              options={mapToOptions(homebaseData)}
              placeholder='Pilih Satuan Pendidikan'
            />
          </Form.Item>
        </Col>

        {/* Data Pribadi */}
        <Col xs={24} md={12}>
          <Form.Item
            name='name'
            label='Nama Lengkap'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name='gender'
            label='Jenis Kelamin'
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "L", label: "Laki-laki" },
                { value: "P", label: "Perempuan" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name='nis' label='NIS'>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name='nisn' label='NISN'>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name='birth_place' label='Tempat Lahir'>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name='birth_date' label='Tanggal Lahir'>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* Data Fisik */}
        <Col xs={12} md={8}>
          <Form.Item name='height' label='Tinggi (cm)'>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={12} md={8}>
          <Form.Item name='weight' label='Berat (kg)'>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name='head' label='Kepala (cm)'>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name='order_number' label='Anak Ke-'>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name='siblings' label='Jumlah Saudara'>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* Data Alamat */}
        <Col xs={24} md={12}>
          <Form.Item
            name='provinceid'
            label='Provinsi'
            rules={[{ required: true }]}
          >
            <Select
              loading={isProvinceLoading}
              options={mapToOptions(provinces)}
              placeholder='Pilih Provinsi'
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name='cityid'
            label='Kota/Kabupaten'
            rules={[{ required: true }]}
          >
            <Select
              loading={isCityLoading}
              disabled={!selectedProvince}
              options={mapToOptions(cities)}
              placeholder='Pilih Kota/Kabupaten'
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name='districtid'
            label='Kecamatan'
            rules={[{ required: true }]}
          >
            <Select
              loading={isDistrictLoading}
              disabled={!selectedCity}
              options={mapToOptions(districts)}
              placeholder='Pilih Kecamatan'
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name='villageid'
            label='Desa/Kelurahan'
            rules={[{ required: true }]}
          >
            <Select
              loading={isVillageLoading}
              disabled={!selectedDistrict}
              options={mapToOptions(villages)}
              placeholder='Pilih Desa/Kelurahan'
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name='postal_code' label='Kode Pos'>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name='address' label='Alamat Lengkap (Nama Jalan, RT/RW)'>
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  return (
    <Spin spinning={isUpdating}>
      <Card
        title={<Title level={5}>Informasi Pribadi Siswa</Title>}
        extra={
          isEditing ? (
            <Space>
              <Button
                icon={<SaveOutlined />}
                type='primary'
                onClick={() => form.submit()}
                loading={isUpdating}
              >
                Simpan
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Batal
              </Button>
            </Space>
          ) : (
            <Button icon={<EditOutlined />} type='primary' onClick={handleEdit}>
              Edit Biodata
            </Button>
          )
        }
      >
        {isEditing ? renderEditMode() : renderViewMode()}
      </Card>
    </Spin>
  );
};

export default PersonalData;
