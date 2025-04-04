import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import ToastContainer from './components/ui/ToastContainer';
import { useToastStore } from './stores/toastStore';
import { HomePage } from './pages/HomePage';
import { GetStartedPage } from './pages/GetStartedPage';
import { AuthPage } from './pages/AuthPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { ListingForm } from './pages/ListingForm';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PaymentPage } from './pages/PaymentPage';
import NotificationsPage from './pages/NotificationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const { toasts, removeToast } = useToastStore();

  return (
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
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell/new"
            element={
              <ProtectedRoute>
                <ListingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell/edit/:id"
            element={
              <ProtectedRoute>
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
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/payment/:paymentId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;