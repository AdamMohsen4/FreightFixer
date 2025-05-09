import { Routes, Route } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import ShipmentsPage from "./pages/ShipmentsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      <Route
        element={
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
          </SidebarProvider>
        }
      >
        <Route path="shipments" element={<ShipmentsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
