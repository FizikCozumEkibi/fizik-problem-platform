import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Solver from './pages/Solver';
import Solution from './pages/Solution';
import Formulas from './pages/Formulas';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="solver" element={<ProtectedRoute><Solver /></ProtectedRoute>} />
          <Route path="solution/:id" element={<ProtectedRoute><Solution /></ProtectedRoute>} />
          <Route path="formulas" element={<ProtectedRoute><Formulas /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
