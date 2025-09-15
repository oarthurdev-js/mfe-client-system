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
const AuthApp = React.lazy(() => 
  import('authMfe/AuthApp').catch(() => {
    console.warn('AuthApp federation module failed to load, using fallback');
    return { default: () => <div>Auth module temporarily unavailable</div> };
  })
);

const ClientsApp = React.lazy(() => 
  import('clientsMfe/ClientsApp').catch(() => {
    console.warn('ClientsApp federation module failed to load, using fallback');
    return { default: () => <div>Clients module temporarily unavailable</div> };
  })
);

function App() {
  return(
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
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