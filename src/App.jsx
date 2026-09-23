import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import API from "./api/api";

import Layout from "./components/Layout/Layout";

// ==========================================
// ADMIN
// ==========================================

import AdminLayout from "./components/AdminDashoard/AdminLayout/Layout";
import Dashboard from "./components/AdminDashoard/Dashboard";
import Enrollment from "./components/AdminDashoard/Enrollment/Enrollment";
import Student from "./components/AdminDashoard/Students/Students";
import Teacher from "./components/AdminDashoard/Teacher/Teacher";
import Courses from "./components/AdminDashoard/Courses/Courses";
import Payments from "./components/AdminDashoard/Payment/Payment";
import FeeManagement from "./components/AdminDashoard/FeeManagment/FeeManagment";
import Messages from "./components/AdminDashoard/Message/Message";
import Library from "./components/AdminDashoard/AdminLibrary/AdminLibrary";
import Settings from "./components/AdminDashoard/AdminSetting/AdminSetting";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Login/Login";
import Course from "./Pages/Course/Course";
import PublicLibrary from "./Pages/Library/Library";
import Signup from "./Pages/Signup/Signup";
import Enroll from "./Pages/Enroll/Enroll";
import PendingApproval from "./Pages/PendingApproval/PendingApproval";

// ⭐ PUBLIC RESULT PAGE
import Result from "./Pages/Result/Result";

// ==========================================
// TEACHER
// ==========================================

import TeacherLayout from "./Pages/TeacherLayout/TeacherLayout";
import TeacherProfile from "./Pages/TeacherDashboard/TeacherProfile/TeacherProfile";
import TeacherStudent from "./Pages/TeacherDashboard/TeacherStudent/TeacherStudent";
import Attendance from "./Pages/TeacherDashboard/Attendance/Attendance";
import StudentResult from "./Pages/TeacherDashboard/StudentResult/Result";
import TeacherMessage from "./Pages/TeacherDashboard/TeacherMessage/Message";
import TeacherDashboard from "./Pages/TeacherDashboard/TeacherDashboard";

// ==========================================
// STUDENT
// ==========================================

import Dasboard from "./components/StudentDashboard/Dasboard";
import Welcome from "./components/StudentDashboard/Welcome/Welcome";
import MyCourse from "./components/StudentDashboard/My Course/MY Course";
import MyTeacher from "./components/StudentDashboard/My Teacher/My Teacher";
import Progress from "./components/StudentDashboard/My Progress/Progress";
import Profile from "./components/StudentDashboard/Profile/Profile";
import Setting from "./components/StudentDashboard/Setting/Setting";
import Certificate from "./components/StudentDashboard/Certificate/Certificate";
import Logout from "./components/StudentDashboard/Logout/Logout";
import Fee from "./components/StudentDashboard/Fee/Fee";

// ==========================================
// SECURITY
// ==========================================

import ProtectedRoute from "./ProtectedRoute/ProtectRoute";

import "./App.css";

function App() {
  // =====================================================
  // ADMIN DATA
  // =====================================================

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);

  // =====================================================
  // GET ALL STUDENTS
  // ONLY ADMIN CAN ACCESS /students
  // =====================================================

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        console.log("Token not found.");
        return;
      }

      if (!savedUser) {
        console.log("User data not found.");
        return;
      }

      let user;

      try {
        user = JSON.parse(savedUser);
      } catch (parseError) {
        console.error(
          "USER JSON PARSE ERROR:",
          parseError
        );
        return;
      }

      // =================================================
      // DO NOT CALL /students FOR STUDENT
      // =================================================

      if (user?.role !== "admin") {
        console.log(
          "Skipping /students request."
        );

        console.log(
          "Current role:",
          user?.role
        );

        return;
      }

      // =================================================
      // ADMIN REQUEST
      // =================================================

      const response = await API.get(
        "/students"
      );

      console.log(
        "ADMIN STUDENTS:",
        response.data
      );

      if (response.data.success) {
        setStudents(
          response.data.students || []
        );
      }
    } catch (error) {
      console.error(
        "FETCH ADMIN STUDENTS ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        console.log(
          "Session expired."
        );
      }

      if (
        error.response?.status === 403
      ) {
        console.log(
          "Forbidden: Current user is not allowed to access all students."
        );
      }
    } finally {
      setLoadingStudents(false);
    }
  };

  // =====================================================
  // LOAD STUDENTS
  // ONLY ADMIN
  // =====================================================

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      setLoadingStudents(false);
      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      if (user?.role === "admin") {
        fetchStudents();
      } else {
        console.log(
          "User is not admin. Student API skipped."
        );

        setLoadingStudents(false);
      }
    } catch (error) {
      console.error(
        "USER DATA ERROR:",
        error
      );

      setLoadingStudents(false);
    }
  }, []);

  // =====================================================
  // ADD STUDENT
  // =====================================================

  const addStudent = (newStudent) => {
    setStudents((prev) => [
      newStudent,
      ...prev,
    ]);
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {
    try {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this student?"
        );

      if (!confirmDelete) return;

      const response =
        await API.delete(
          `/students/${id}`
        );

      if (response.data.success) {
        setStudents((prev) =>
          prev.filter(
            (student) =>
              (student._id ||
                student.id) !== id
          )
        );

        alert(
          "Student deleted successfully."
        );
      }
    } catch (error) {
      console.error(
        "DELETE STUDENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete student."
      );
    }
  };

  // =====================================================
  // ADMIN UPDATE FEE STATUS
  // =====================================================

  const updateFeeStatus = async (
    studentId,
    newFeeStatus,
    feeData = {}
  ) => {
    try {
      if (!studentId) {
        alert(
          "Student ID is missing."
        );
        return;
      }

      const payload = {
        feeStatus: newFeeStatus,
        ...feeData,
      };

      console.log(
        "UPDATING STUDENT FEE:",
        studentId
      );

      console.log(
        "FEE PAYLOAD:",
        payload
      );

      const response =
        await API.put(
          `/students/${studentId}/fee`,
          payload
        );

      console.log(
        "FEE UPDATE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        const updatedStudent =
          response.data.student;

        setStudents(
          (prevStudents) =>
            prevStudents.map(
              (student) => {
                const currentId =
                  student._id ||
                  student.id;

                if (
                  currentId ===
                  studentId
                ) {
                  if (
                    updatedStudent
                  ) {
                    return updatedStudent;
                  }

                  return {
                    ...student,
                    ...feeData,
                    feeStatus:
                      newFeeStatus,
                    paymentDate:
                      newFeeStatus ===
                      "Paid"
                        ? new Date()
                        : student.paymentDate,
                  };
                }

                return student;
              }
            )
        );

        alert(
          `Fee status updated to ${newFeeStatus}.`
        );
      }
    } catch (error) {
      console.error(
        "UPDATE FEE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update student fee."
      );
    }
  };

  // =====================================================
  // ADMIN SET STUDENT FEE
  // =====================================================

  const updateStudentFee = async (
    studentId,
    feeData
  ) => {
    try {
      if (!studentId) {
        alert(
          "Student ID is missing."
        );
        return;
      }

      const response =
        await API.put(
          `/students/${studentId}/fee`,
          {
            ...feeData,
          }
        );

      console.log(
        "SET FEE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        const updatedStudent =
          response.data.student;

        setStudents(
          (prevStudents) =>
            prevStudents.map(
              (student) => {
                const currentId =
                  student._id ||
                  student.id;

                if (
                  currentId ===
                  studentId
                ) {
                  if (
                    updatedStudent
                  ) {
                    return updatedStudent;
                  }

                  return {
                    ...student,
                    ...feeData,
                  };
                }

                return student;
              }
            )
        );

        alert(
          "Student fee information updated successfully."
        );

        return updatedStudent;
      }
    } catch (error) {
      console.error(
        "SET STUDENT FEE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to set student fee."
      );

      throw error;
    }
  };

  // =====================================================
  // ADD TEACHER
  // =====================================================

  const addTeacher = (newTeacher) => {
    setTeachers((prev) => [
      newTeacher,
      ...prev,
    ]);
  };

  // =====================================================
  // DELETE TEACHER
  // =====================================================

  const deleteTeacher = (id) => {
    setTeachers((prev) =>
      prev.filter((teacher) => {
        const teacherId =
          teacher.id ||
          teacher._id;

        return teacherId !== id;
      })
    );
  };

  // =====================================================
  // ADD COURSE
  // =====================================================

  const addCourse = (newCourse) => {
    setCourses((prev) => [
      newCourse,
      ...prev,
    ]);
  };

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const deleteCourse = (id) => {
    setCourses((prev) =>
      prev.filter((course) => {
        const courseId =
          course.id ||
          course._id;

        return courseId !== id;
      })
    );
  };

  // =====================================================
  // ROUTES
  // =====================================================

  return (
    <Routes>

      {/* =====================================================
          1. TEACHER DASHBOARD
      ===================================================== */}

      <Route
        path="/TeacherLayout"
        element={
          <ProtectedRoute
            allowedRoles={[
              "teacher",
              "admin",
            ]}
          >
            <TeacherLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <TeacherDashboard />
          }
        />

        <Route
          path="dashboard"
          element={
            <TeacherDashboard />
          }
        />

        <Route
          path="profile"
          element={
            <TeacherProfile />
          }
        />

        <Route
          path="students"
          element={
            <TeacherStudent />
          }
        />

        <Route
          path="attendance"
          element={
            <Attendance />
          }
        />

        {/* ⭐ TEACHER RESULT MANAGEMENT */}

        <Route
          path="results"
          element={
            <StudentResult />
          }
        />

        <Route
          path="messages"
          element={
            <TeacherMessage />
          }
        />

      </Route>


      {/* =====================================================
          2. STUDENT DASHBOARD
      ===================================================== */}

      <Route
        path="/StudentDashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "student",
            ]}
            requireEnrollment={true}
          >
            <Dasboard />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}

        <Route
          index
          element={
            <Welcome />
          }
        />

        <Route
          path="dashboard"
          element={
            <Welcome />
          }
        />

        <Route
          path="welcome"
          element={
            <Welcome />
          }
        />

        {/* My Courses */}

        <Route
          path="mycourse"
          element={
            <MyCourse />
          }
        />

        {/* My Teacher */}

        <Route
          path="teacher"
          element={
            <MyTeacher />
          }
        />

        {/* My Progress */}

        <Route
          path="progress"
          element={
            <Progress />
          }
        />

        {/* Student Fee */}

        <Route
          path="fee"
          element={
            <Fee />
          }
        />

        {/* Profile */}

        <Route
          path="profile"
          element={
            <Profile />
          }
        />

        {/* Settings */}

        <Route
          path="setting"
          element={
            <Setting />
          }
        />

        {/* Certificate */}

        <Route
          path="certificate"
          element={
            <Certificate />
          }
        />

        {/* Logout */}

        <Route
          path="logout"
          element={
            <Logout />
          }
        />

      </Route>


      {/* =====================================================
          3. PENDING APPROVAL
      ===================================================== */}

      <Route
        path="/PendingApproval"
        element={
          <ProtectedRoute
            allowedRoles={[
              "student",
            ]}
            requireEnrollment={false}
          >
            <PendingApproval />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          4. ADMIN DASHBOARD
      ===================================================== */}

      <Route
        path="/AdminDashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "admin",
            ]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* Admin Dashboard */}

        <Route
          index
          element={
            <Dashboard
              students={students}
              teachers={teachers}
              courses={courses}
            />
          }
        />

        {/* Students */}

        <Route
          path="Students"
          element={
            <Student
              students={students}
              teachers={teachers}
              courses={courses}
              onAddStudent={
                addStudent
              }
              onDeleteStudent={
                deleteStudent
              }
            />
          }
        />

        {/* Teachers */}

        <Route
          path="Teacher"
          element={
            <Teacher
              teachers={teachers}
              onAddTeacher={
                addTeacher
              }
              onDeleteTeacher={
                deleteTeacher
              }
            />
          }
        />

        {/* Courses */}

        <Route
          path="Courses"
          element={
            <Courses
              courses={courses}
              onAddCourse={
                addCourse
              }
              onDeleteCourse={
                deleteCourse
              }
            />
          }
        />

        {/* Enrollments */}

        <Route
          path="Enrollment"
          element={
            <Enrollment
              enrollments={
                students
              }
            />
          }
        />

        {/* Old Payment */}

        <Route
          path="Payment"
          element={
            <Payments
              students={students}
              onUpdateFeeStatus={
                updateFeeStatus
              }
            />
          }
        />

        {/* Fee Management */}

        <Route
          path="FeeManagement"
          element={
            <FeeManagement
              students={students}
              onUpdateFeeStatus={
                updateFeeStatus
              }
              onUpdateFee={
                updateStudentFee
              }
            />
          }
        />

        {/* Messages */}

        <Route
          path="Message"
          element={
            <Messages />
          }
        />

        {/* Library */}

        <Route
          path="AdminLibrary"
          element={
            <Library />
          }
        />

        {/* Settings */}

        <Route
          path="AdminSetting"
          element={
            <Settings />
          }
        />

      </Route>


      {/* =====================================================
          5. PUBLIC WEBSITE
      ===================================================== */}

      <Route
        path="/*"
        element={
          <Layout>

            <Routes>

              {/* HOME */}

              <Route
                index
                element={
                  <Home />
                }
              />

              <Route
                path="Home"
                element={
                  <Home />
                }
              />

              {/* ABOUT */}

              <Route
                path="About"
                element={
                  <About />
                }
              />

              {/* LIBRARY */}

              <Route
                path="Library"
                element={
                  <PublicLibrary />
                }
              />

              {/* COURSES */}

              <Route
                path="Course"
                element={
                  <Course />
                }
              />

              {/* CONTACT */}

              <Route
                path="Contact"
                element={
                  <Contact />
                }
              />

              {/* LOGIN */}

              <Route
                path="Login"
                element={
                  <Login />
                }
              />

              {/* SIGNUP */}

              <Route
                path="Signup"
                element={
                  <Signup />
                }
              />

              {/* ENROLL */}

              <Route
                path="Enroll"
                element={
                  <Enroll />
                }
              />

              {/* =================================================
                  ⭐ PUBLIC RESULT PAGE
                  
                  Header "View Result" →
                  /result →
                  Result.jsx
                  
                  User enters:
                  • Phone Number
                  • Roll Number
                  
                  Then views professional result.
              ================================================= */}

              <Route
                path="result"
                element={
                  <Result />
                }
              />

            </Routes>

          </Layout>
        }
      />

    </Routes>
  );
}

export default App;