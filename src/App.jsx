import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import ContactsPage from "@/components/pages/ContactsPage";
import DealsPage from "@/components/pages/DealsPage";
import TasksPage from "@/components/pages/TasksPage";
import ReportsPage from "@/components/pages/ReportsPage";
import SettingsPage from "@/components/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/contacts" replace />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;