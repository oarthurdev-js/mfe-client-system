import React, { Suspense } from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Microfrontend loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong loading this module.</h2>
          <p>Error: {this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#ff6b35', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Conditional lazy loading with fallbacks
const AuthApp = React.lazy(() => {
  console.log('Loading AuthApp from:', 'authMfe/AuthApp');
  return import('authMfe/AuthApp').catch((err) => {
    console.error('AuthApp federation module failed to load:', err);
    return { default: () => (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Auth module temporarily unavailable</h3>
        <p>Please try refreshing the page</p>
      </div>
    )};
  });
});

const ClientsApp = React.lazy(() => {
  console.log('Loading ClientsApp from:', 'clientsMfe/ClientsApp');
  return import('clientsMfe/ClientsApp').catch((err) => {
    console.error('ClientsApp federation module failed to load:', err);
    return { default: () => (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Clients module temporarily unavailable</h3>
        <p>Please try refreshing the page</p>
      </div>
    )};
  });
});

function App() {
  return(
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Suspense fallback={
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px',
              margin: '20px'
            }}>
              <div>Loading microfrontend...</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                Shell is loading the remote modules
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth/*" element={
                <ErrorBoundary>
                  <AuthApp />
                </ErrorBoundary>
              } />
              <Route path="/clients/*" element={
                <ErrorBoundary>
                  <ClientsApp />
                </ErrorBoundary>
              } />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App;