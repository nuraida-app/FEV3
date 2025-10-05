import {
  DoubleLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Layout,
  Menu,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminMenus, CenterMenus, TeacherMenus } from "./Menus";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../service/api/auth/ApiAuth";
import { setLogout } from "../../service/slice/AuthSlice";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children, levels, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(() => {
    const savedCollapsed = localStorage.getItem("collapsed");
    return savedCollapsed !== null ? JSON.parse(savedCollapsed) : false;
  });

  const { user } = useSelector((state) => state.auth);
  const isSignin = localStorage.getItem("isSignin");

  const level = user?.level;

  const [logout, { isLoading, isSuccess, isError, data, error }] =
    useLogoutMutation();

  const handleCollapsedChange = (value) => {
    setCollapsed(value);
    localStorage.setItem("collapsed", JSON.stringify(value));
  };

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
    } else {
      navigate(key);
    }
  };

  let mainMenuItems = [];
  let secondaryMenuItems = [];

  switch (user?.level) {
    case "center":
      mainMenuItems = CenterMenus.slice(0, 4);
      secondaryMenuItems = CenterMenus.slice(4);
      break;
    case "admin":
      mainMenuItems = AdminMenus.slice(0, 6);
      secondaryMenuItems = AdminMenus.slice(6);
      break;
    case "teacher":
      // Cek apakah guru adalah wali kelas (homeroom)
      if (user?.homeroom) {
        mainMenuItems = TeacherMenus.slice(0, 4);
        secondaryMenuItems = TeacherMenus.slice(4);
      } else {
        // Jika bukan wali kelas, tampilkan semua menu
        mainMenuItems = TeacherMenus.slice(0, 4);
        secondaryMenuItems = TeacherMenus.slice(4);
      }
      break;
    case "student":
      mainMenuItems = StudentMenus.slice(0, 1);
      secondaryMenuItems = StudentMenus.slice(1);
      break;
    case "parent":
      mainMenuItems = ParentMenus.slice(0, 1);
      secondaryMenuItems = ParentMenus.slice(1);
      break;
    case "tahfiz":
      mainMenuItems = TahfizMenus.slice(0, 1);
      secondaryMenuItems = TahfizMenus.slice(1);
      break;
    default:
      // Menu kosong jika level tidak dikenali
      mainMenuItems = [];
      secondaryMenuItems = [];
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user || !isSignin || !levels.includes(user?.level)) {
        if (user === null || (user && Object.keys(user).length === 0)) {
          window.location.href = "/";
        } else {
          window.location.href = "/";
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [user, isSignin, levels]);

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem("isSignin");
      localStorage.removeItem("collapsed");
      dispatch(setLogout());
      message.success(data.message);

      window.location.href = "/";
    }

    if (isError) {
      message.error(error.data.message);
    }
  }, [isSuccess, isError, data, error]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <title>{title}</title>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "#001529",
          boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          color: "#fff",
        }}
        breakpoint='lg'
        onBreakpoint={(broken) => {
          if (broken) {
            handleCollapsedChange(true);
          }
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 16,
          }}
        >
          {collapsed ? (
            <img src='logo.png' alt='logo' height={40} />
          ) : (
            <Flex align='center' gap={12}>
              <img src='logo.png' alt='logo' height={40} />
              <Title level={5} style={{ color: "#fff", margin: 0 }}>
                NURAIDA
              </Title>
            </Flex>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 80px)",
            justifyContent: "space-between",
          }}
        >
          <Menu
            items={mainMenuItems}
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            theme='dark'
          />

          <Menu
            items={secondaryMenuItems}
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            theme='dark'
          />
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Header */}
        <Header
          style={{
            backgroundColor: "#001529",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            height: "64px",
            position: "fixed",
            top: 0,
            right: 0,
            left: collapsed ? 80 : 200,
            zIndex: 999,
            transition: "left 0.2s",
          }}
        >
          <Button
            type='default'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => handleCollapsedChange(!collapsed)}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "white",
                  lineHeight: "1.2",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: "1.2",
                }}
              >
                {user?.level}
              </div>
            </div>
          </div>
        </Header>

        {/* Content */}

        <Content
          style={{
            margin: "70px 10px 10px 10px",
            padding: "24px",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            minHeight: "calc(100vh - 180px)",
            overflow: "auto",
          }}
        >
          <Spin spinning={isLoading} tip='Loading...'>
            {children}
          </Spin>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", background: "#fafafa" }}>
          <span>&copy; {new Date().getFullYear()}</span> NIBS
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
