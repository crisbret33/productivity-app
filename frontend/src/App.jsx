import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage'; // Importa la nueva página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Los dos puntos :id significan que eso cambia dinámicamente */}
        <Route path="/board/:id" element={<BoardPage />} /> 
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;