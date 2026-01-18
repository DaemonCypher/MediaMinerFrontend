import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./firebase/auth";
import RequireAuth from "./firebase/requireAuth";
import HomePage from "./pages/HomePage";
import DownloadPage from "./pages/DownloadPage";
import Navbar from "./components/NavBar";
import JobsPage from "./pages/JobsPage"; 
import LogPage from "./pages/LogPage"; 

// import DownloadPage from "./pages/downloadPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/downloads" element={<DownloadPage/>} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId/log" element={<LogPage />} />

        {/* <Route path="/downloads" element={<DownloadPage/>} /> */}

          {/* <Route path="/" element={<LoginPage />} />
          {/* <Route path="/" element={<LoginPage />} />

          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppPage />
              </RequireAuth>
            }
          />

          <Route path="*" element={<LoginPage />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
