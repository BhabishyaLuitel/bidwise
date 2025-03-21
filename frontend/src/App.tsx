import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { GetStartedPage } from './pages/GetStartedPage';
import { AuthPage } from './pages/AuthPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { ListingForm } from './pages/ListingForm';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/get-started" element={<GetStartedPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route
                path="/marketplace/:id"
                element={<ItemDetailPage />}
              />
              <Route
                path="/sell"
                element={
                  <ProtectedRoute requiredPermission="create:listing">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sell/new"
                element={
                  <ProtectedRoute requiredPermission="create:listing">
                    <ListingForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sell/edit/:id"
                element={
                  <ProtectedRoute requiredPermission="edit:listing">
                    <ListingForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredPermission="view:admin_dashboard">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;