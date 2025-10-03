import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./module/auth/Login";
import LoadingScreen from "./components/loaders/LoadingScreen";
import { useLoadUserQuery } from "./service/api/auth/ApiAuth";

// Center
const CenterDash = lazy(() => import("./module/center/Dashboard/CenterDash"));
const CenterAdmin = lazy(() => import("./module/center/admin/CenterAdmin"));
const CenterHomebase = lazy(() =>
  import("./module/center/homebase/CenterHomebase")
);
const CenterAnalysis = lazy(() =>
  import("./module/center/analysis/CenterAnalysis")
);

// Admin
const AdminDash = lazy(() => import("./module/admin/dashboard/AdminDash"));
const AdminData = lazy(() => import("./module/admin/data/AdminData"));
const AdminStudent = lazy(() => import("./module/admin/student/AdminStudent"));
const AdminAcademic = lazy(() =>
  import("./module/admin/academic/AdminAcademic")
);

// Teacher
const TeacherDash = lazy(() =>
  import("./module/teacher/dashboard/TeacherDash")
);

// CBT
const CbtControl = lazy(() => import("./module/cbt/control/CbtControl"));

// LMS
const LmsControl = lazy(() => import("./module/lms/control/LmsControl"));

const App = () => {
  const isSignin = localStorage.getItem("isSignin");

  const { isLoading } = useLoadUserQuery(undefined, { skip: !isSignin });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Center */}
            <Route path="/center-dashboard" element={<CenterDash />} />

            <Route path="/center-admin" element={<CenterAdmin />} />

            <Route path="/center-satuan" element={<CenterHomebase />} />

            <Route path="/center-market" element={<CenterAnalysis />} />

            {/* Admin */}
            <Route path="/admin-dashboard" element={<AdminDash />} />

            <Route path="/admin-data-pokok" element={<AdminData />} />

            <Route path="/admin-data-siswa" element={<AdminStudent />} />

            <Route path="/admin-data-akademik" element={<AdminAcademic />} />

            {/* Teacher */}
            <Route path="/guru-dashboard" element={<TeacherDash />} />

            {/* CBT */}
            <Route path="/computer-based-test" element={<CbtControl />} />

            {/* LMS */}
            <Route
              path="/learning-management-system"
              element={<LmsControl />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DndProvider>
  );
};

export default App;
