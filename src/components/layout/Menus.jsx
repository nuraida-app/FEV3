import {
  ApartmentOutlined,
  AuditOutlined,
  BranchesOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  DotChartOutlined,
  FolderOutlined,
  HomeOutlined,
  IdcardOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

export const CenterMenus = [
  {
    label: "Dashboard",
    key: "/center-dashboard",
    icon: <WindowsOutlined />,
  },
  { label: "Satuan", key: "/center-satuan", icon: <HomeOutlined /> },
  { label: "Admin", key: "/center-admin", icon: <IdcardOutlined /> },
  { label: "Market", key: "/center-market", icon: <DotChartOutlined /> },

  { label: "Profile", key: "/profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];

export const AdminMenus = [
  {
    label: "Dashboard",
    key: "/admin-dashboard",
    icon: <WindowsOutlined />,
  },
  {
    label: "Data Pokok",
    key: "/admin-data-pokok",
    icon: <FolderOutlined />,
  },
  {
    label: "Data Akademik",
    key: "/admin-data-akademik",
    icon: <AuditOutlined />,
  },
  {
    label: "Data Siswa",
    key: "/admin-data-siswa",
    icon: <ApartmentOutlined />,
  },
  {
    label: "Database",
    key: "/database",
    icon: <DatabaseOutlined />,
  },
  {
    label: "CBT",
    key: "/computer-based-test",
    icon: <DesktopOutlined />,
  },

  { label: "Profile", key: "/profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];

export const TeacherMenus = [
  {
    label: "Dashboard",
    key: "/guru-dashboard",
    icon: <WindowsOutlined />,
  },
  {
    label: "LMS",
    key: "/learning-management-system",
    icon: <BranchesOutlined />,
  },
  {
    label: "CBT",
    key: "/computer-based-test",
    icon: <DesktopOutlined />,
  },
  {
    label: "Database",
    key: "/database",
    icon: <DatabaseOutlined />,
  },
  { label: "Profile", key: "/profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];

export const StudentMenus = [
  {
    label: "Dashboard",
    key: "/siswa-dashboard",
    icon: <WindowsOutlined />,
  },
  { label: "Profile", key: "/profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];

export const ParentMenus = [
  {
    label: "Dashboard",
    key: "/orangtua-dashboard",
    icon: <WindowsOutlined />,
  },
  { label: "Profile", key: "/profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];

export const TahfizMenus = [
  {
    label: "Dashboard",
    key: "/tahfiz-dashboard",
    icon: <WindowsOutlined />,
  },
  { label: "Profile", key: "/profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];
