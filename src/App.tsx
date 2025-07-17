import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import NotFound from './pages/NotFound';
import Landing from './pages/LandingPage';

// Components
import { Loader } from './components/ui/Loader';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/login" /> : <Landing/>} 
      />
      <Route 
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard /> : <Navigate to="/" />} 
      />
      <Route 
        path="/document/:id" 
        element={user ? <DocumentEditor /> : <Navigate to="/" />} 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;