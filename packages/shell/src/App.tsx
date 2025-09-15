import React, { Suspense } from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Microfrontend loading error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong loading this module.</h2>
          <p>Error: {this.state.error?.message}</p>
          <details style={{ marginBottom: '15px', textAlign: 'left' }}>
            <summary>Show Details</summary>
            <pre style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {this.state.error?.stack}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
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
  const loadModule = async () => {
    try {
      const module = await import('authMfe/AuthApp');
      console.log('AuthApp module loaded successfully');
      return module;
    } catch (error) {
      console.error('Failed to load AuthApp:', error);
      console.warn('AuthApp federation module failed to load, using fallback');
      return { 
        default: () => (
          <div style={{ padding: '20px', textAlign: 'center', minHeight: '400px' }}>
            <h2>Auth Module Unavailable</h2>
            <p>The authentication module is temporarily unavailable.</p>
            <p>Please try refreshing the page or contact support if the issue persists.</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        ) 
      };
    }
  };
  return loadModule();
});

const ClientsApp = React.lazy(() => {
  const loadModule = async () => {
    try {
      const module = await import('clientsMfe/ClientsApp');
      console.log('ClientsApp module loaded successfully');
      return module;
    } catch (error) {
      console.error('Failed to load ClientsApp:', error);
      console.warn('ClientsApp federation module failed to load, using fallback');
      return { 
        default: () => (
          <div style={{ padding: '20px', textAlign: 'center', minHeight: '400px' }}>
            <h2>Clients Module Unavailable</h2>
            <p>The clients module is temporarily unavailable.</p>
            <p>Please try refreshing the page or contact support if the issue persists.</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        ) 
      };
    }
  };
  return loadModule();
});

function App() {
  // Add debugging for production environment
  React.useEffect(() => {
    console.log('Shell App starting...');
    console.log('Environment:', import.meta.env.MODE);
    console.log('Current location:', window.location.href);
    
    // Check if remoteEntry.js files are accessible
    const checkRemoteEntries = async () => {
      const remoteUrls = [
        'https://auth-mfe-arthur-marques-projects-08ec456b.vercel.app/assets/remoteEntry.js',
        'https://clients-mfe-arthur-marques-projects-08ec456b.vercel.app/assets/remoteEntry.js',
        'https://design-system-five-hazel.vercel.app/assets/remoteEntry.js'
      ];
      
      for (const url of remoteUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          console.log(`Remote entry ${url}: ${response.status} ${response.statusText}`);
        } catch (error) {
          console.error(`Failed to check remote entry ${url}:`, error);
        }
      }
    };
    
    if (import.meta.env.PROD) {
      checkRemoteEntries();
    }
  }, []);

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
