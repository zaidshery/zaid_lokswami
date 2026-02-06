import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/stores/auth.store';

// Layout
import { AdminLayout } from '@/components/layout/AdminLayout';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { ArticleEditorPage } from '@/pages/ArticleEditorPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { MediaPage } from '@/pages/MediaPage';
import { SettingsPage } from '@/pages/SettingsPage';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/articles/new" element={<ArticleEditorPage />} />
                    <Route path="/articles/edit/:id" element={<ArticleEditorPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/media" element={<MediaPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster position="top-right" richColors />
      </Router>
    </QueryClientProvider>
  );
}

export default App;