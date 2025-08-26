// src/App.js
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Create Auth Context
const AuthContext = React.createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('designProUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('designProUser', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('designProUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Login Page Component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    // Simulate login
    login({ name: "Alex Johnson", email, avatar: `https://i.pravatar.cc/150?u=${email}` });
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-icon">✏️</span>
            <span className="logo-text">DesignPro</span>
          </div>
          <p className="tagline">Create Beautiful UML Diagrams</p>
        </div>
        
        <div className="form-container">
          <h2 className="auth-header">Welcome Back</h2>
          <p className="auth-subheader">Sign in to continue your creative journey</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                className="input-field"
              />
              <label className="input-label">Email Address</label>
            </div>
            
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="input-field"
              />
              <label className="input-label">Password</label>
            </div>
            
            <div className="remember-forgot">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  Sign In
                  {isHovered && <span className="button-effect"></span>}
                  {isFocused && <span className="button-focus"></span>}
                </>
              )}
            </button>
          </form>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="social-button github">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
          
          <p className="auth-footer">
            Don't have an account? <a href="/signup" className="link">Sign up</a>
          </p>
        </div>
      </div>
      
      <div className="auth-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [diagrams, setDiagrams] = useState([
    { id: 1, name: 'E-commerce Architecture', type: 'Class Diagram', lastModified: '2 hours ago', color: '#4361ee' },
    { id: 2, name: 'User Flow', type: 'Flowchart', lastModified: '1 day ago', color: '#3f37c9' },
    { id: 3, name: 'API Structure', type: 'Sequence Diagram', lastModified: '3 days ago', color: '#4895ef' },
    { id: 4, name: 'Database Schema', type: 'ER Diagram', lastModified: '1 week ago', color: '#4cc9f0' },
  ]);
  const [newDiagramName, setNewDiagramName] = useState('');
  const [newDiagramType, setNewDiagramType] = useState('Class Diagram');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    diagrams: 12,
    collaborators: 4,
    templates: 8,
    projects: 3
  });

  const createNewDiagram = () => {
    if (newDiagramName.trim() === '') return;
    
    const newDiagram = {
      id: diagrams.length + 1,
      name: newDiagramName,
      type: newDiagramType,
      lastModified: 'Just now',
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    
    setDiagrams([newDiagram, ...diagrams]);
    setStats({...stats, diagrams: stats.diagrams + 1});
    setNewDiagramName('');
    setShowCreateModal(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">✏️</span>
            <span className="logo-text">DesignPro</span>
          </div>
        </div>
        
        <div className="user-profile">
          <div className="avatar" style={{ backgroundImage: `url(${user?.avatar})` }}></div>
          <div className="user-info">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="nav-icon">📁</span>
            Projects
          </button>
          <button 
            className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span className="nav-icon">🎨</span>
            Templates
          </button>
          <button 
            className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <span className="nav-icon">👥</span>
            Team
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>
        
        <button className="logout-btn" onClick={logout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search diagrams..." />
            <button className="search-btn">🔍</button>
          </div>
          
          <div className="user-actions">
            <button className="notification-btn">🔔</button>
            <button className="user-btn">
              <div className="avatar" style={{ backgroundImage: `url(${user?.avatar})` }}></div>
            </button>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name || 'User'}! Here's what you've been working on.</p>
          </div>
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(67, 97, 238, 0.1)', color: '#4361ee' }}>
                📝
              </div>
              <div className="stat-info">
                <h3>{stats.diagrams}</h3>
                <p>Diagrams</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(76, 201, 240, 0.1)', color: '#4cc9f0' }}>
                👥
              </div>
              <div className="stat-info">
                <h3>{stats.collaborators}</h3>
                <p>Collaborators</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(73, 151, 255, 0.1)', color: '#4997ff' }}>
                🎨
              </div>
              <div className="stat-info">
                <h3>{stats.templates}</h3>
                <p>Templates</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(115, 103, 240, 0.1)', color: '#7367f0' }}>
                📂
              </div>
              <div className="stat-info">
                <h3>{stats.projects}</h3>
                <p>Projects</p>
              </div>
            </div>
          </div>
          
          {/* Recent Diagrams */}
          <div className="recent-diagrams">
            <div className="section-header">
              <h2>Recent Diagrams</h2>
              <button 
                className="create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                + Create New
              </button>
            </div>
            
            <div className="diagrams-grid">
              {diagrams.map(diagram => (
                <div key={diagram.id} className="diagram-card">
                  <div 
                    className="diagram-preview" 
                    style={{ backgroundColor: diagram.color }}
                  >
                    <div className="diagram-placeholder"></div>
                  </div>
                  <div className="diagram-info">
                    <h3>{diagram.name}</h3>
                    <div className="diagram-meta">
                      <span className="diagram-type">{diagram.type}</span>
                      <span className="diagram-date">{diagram.lastModified}</span>
                    </div>
                    <div className="diagram-actions">
                      <button className="action-btn edit">Edit</button>
                      <button className="action-btn share">Share</button>
                      <button className="action-btn more">⋯</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Activity Feed */}
          <div className="activity-feed">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              <li>
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p>You created a new <strong>Class Diagram</strong></p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </li>
              <li>
                <div className="activity-icon">👤</div>
                <div className="activity-content">
                  <p><strong>Sarah Johnson</strong> commented on your diagram</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </li>
              <li>
                <div className="activity-icon">🔄</div>
                <div className="activity-content">
                  <p>You updated the <strong>API Structure</strong> diagram</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </li>
              <li>
                <div className="activity-icon">⭐</div>
                <div className="activity-content">
                  <p>You starred the <strong>E-commerce Template</strong></p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Create Diagram Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Diagram</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Diagram Name</label>
                <input 
                  type="text" 
                  value={newDiagramName}
                  onChange={(e) => setNewDiagramName(e.target.value)}
                  placeholder="Enter diagram name"
                  className="modal-input"
                />
              </div>
              
              <div className="form-group">
                <label>Diagram Type</label>
                <select 
                  value={newDiagramType}
                  onChange={(e) => setNewDiagramType(e.target.value)}
                  className="modal-input"
                >
                  <option>Class Diagram</option>
                  <option>Sequence Diagram</option>
                  <option>Flowchart</option>
                  <option>ER Diagram</option>
                  <option>Use Case Diagram</option>
                  <option>Activity Diagram</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Template</label>
                <div className="template-grid">
                  <div className="template-card">Blank</div>
                  <div className="template-card">E-commerce</div>
                  <div className="template-card">API Flow</div>
                  <div className="template-card">Database</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="create-btn" onClick={createNewDiagram}>Create Diagram</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// CSS Styles
const styles = document.createElement('style');
styles.innerHTML = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --secondary: #3f37c9;
    --accent: #4cc9f0;
    --success: #4ade80;
    --warning: #f59e0b;
    --danger: #ef4444;
    --dark: #1e293b;
    --gray: #64748b;
    --light-gray: #f1f5f9;
    --white: #ffffff;
    --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    --transition: all 0.3s ease;
  }
  
  .loading-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: var(--light-gray);
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(67, 97, 238, 0.2);
    border-top: 5px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Auth Styles */
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }
  
  .auth-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  
  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .shape-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
  }
  
  .shape-2 {
    width: 200px;
    height: 200px;
    bottom: -50px;
    right: 100px;
  }
  
  .shape-3 {
    width: 150px;
    height: 150px;
    top: 150px;
    right: -50px;
  }
  
  .auth-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: var(--shadow);
    width: 100%;
    max-width: 450px;
    z-index: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .logo-container {
    padding: 30px 30px 20px;
    text-align: center;
    background: linear-gradient(to right, var(--primary), var(--primary-light));
    color: var(--white);
  }
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 28px;
    font-weight: 700;
  }
  
  .logo-icon {
    font-size: 32px;
  }
  
  .tagline {
    font-size: 14px;
    opacity: 0.9;
    margin-top: 5px;
  }
  
  .form-container {
    padding: 30px;
  }
  
  .auth-header {
    font-size: 24px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 8px;
    text-align: center;
  }
  
  .auth-subheader {
    font-size: 16px;
    color: var(--gray);
    margin-bottom: 30px;
    text-align: center;
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .input-group {
    position: relative;
  }
  
  .input-field {
    width: 100%;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 16px;
    transition: var(--transition);
    background: var(--light-gray);
  }
  
  .input-field:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
    outline: none;
    background: var(--white);
  }
  
  .input-label {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    color: var(--gray);
    pointer-events: none;
    transition: var(--transition);
  }
  
  .input-field:focus + .input-label,
  .input-field:not(:placeholder-shown) + .input-label {
    top: -10px;
    left: 10px;
    font-size: 12px;
    background: var(--white);
    padding: 0 5px;
    color: var(--primary);
  }
  
  .remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox-container input {
    display: none;
  }
  
  .checkmark {
    width: 18px;
    height: 18px;
    border: 2px solid var(--primary);
    border-radius: 4px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .checkbox-container input:checked + .checkmark::after {
    content: '✓';
    color: var(--primary);
    font-size: 12px;
  }
  
  .forgot-password {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
  }
  
  .auth-button {
    background: linear-gradient(to right, var(--primary), var(--primary-light));
    color: var(--white);
    padding: 16px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .auth-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(67, 97, 238, 0.3);
  }
  
  .auth-button.loading {
    opacity: 0.8;
    cursor: not-allowed;
  }
  
  .button-effect {
    position: absolute;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
  }
  
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  .button-focus {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(67, 97, 238, 0.5);
    border-radius: 10px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
  
  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
  }
  
  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  .divider span {
    padding: 0 15px;
    color: var(--gray);
    font-size: 14px;
  }
  
  .social-login {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .social-button {
    flex: 1;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .social-button:hover {
    background: var(--light-gray);
    transform: translateY(-2px);
  }
  
  .social-button.google {
    color: #4285F4;
  }
  
  .social-button.github {
    color: #333;
  }
  
  .social-icon {
    width: 20px;
    height: 20px;
  }
  
  .auth-footer {
    text-align: center;
    color: var(--gray);
    font-size: 14px;
  }
  
  .link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
  }
  
  /* Dashboard Styles */
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background: var(--light-gray);
  }
  
  .sidebar {
    width: 260px;
    background: var(--white);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    z-index: 100;
  }
  
  .sidebar-header {
    padding: 25px 20px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary);
  }
  
  .logo-icon {
    font-size: 24px;
  }
  
  .user-profile {
    padding: 25px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    border: 2px solid var(--primary-light);
  }
  
  .user-info h3 {
    font-size: 16px;
    margin-bottom: 4px;
  }
  
  .user-info p {
    font-size: 14px;
    color: var(--gray);
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 14px 20px;
    background: transparent;
    border: none;
    text-align: left;
    color: var(--gray);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .nav-item:hover {
    background: var(--light-gray);
    color: var(--primary);
  }
  
  .nav-item.active {
    background: rgba(67, 97, 238, 0.1);
    color: var(--primary);
    border-left: 4px solid var(--primary);
  }
  
  .nav-icon {
    margin-right: 12px;
    font-size: 20px;
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background: transparent;
    border: none;
    text-align: left;
    color: var(--danger);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-top: 1px solid #e2e8f0;
  }
  
  .logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .top-bar {
    padding: 15px 30px;
    background: var(--white);
    box-shadow: var(--shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    background: var(--light-gray);
    border-radius: 30px;
    padding: 5px 15px;
    width: 400px;
  }
  
  .search-bar input {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    outline: none;
  }
  
  .search-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--gray);
    font-size: 18px;
  }
  
  .user-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .notification-btn {
    background: transparent;
    border: none;
    font-size: 20px;
    color: var(--gray);
    cursor: pointer;
    position: relative;
  }
  
  .notification-btn::after {
    content: '';
    position: absolute;
    top: 5px;
    right: 0;
    width: 8px;
    height: 8px;
    background: var(--danger);
    border-radius: 50%;
    border: 2px solid var(--white);
  }
  
  .user-btn {
    background: transparent;
    border: none;
    cursor: pointer;
  }
  
  .user-btn .avatar {
    width: 40px;
    height: 40px;
  }
  
  .dashboard-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
  }
  
  .dashboard-header {
    margin-bottom: 30px;
  }
  
  .dashboard-header h1 {
    font-size: 32px;
    color: var(--dark);
    margin-bottom: 10px;
  }
  
  .dashboard-header p {
    color: var(--gray);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: var(--white);
    border-radius: 15px;
    padding: 20px;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    transition: var(--transition);
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-right: 15px;
  }
  
  .stat-info h3 {
    font-size: 24px;
    color: var(--dark);
    margin-bottom: 5px;
  }
  
  .stat-info p {
    color: var(--gray);
    font-size: 14px;
  }
  
  .recent-diagrams {
    background: var(--white);
    border-radius: 15px;
    padding: 25px;
    box-shadow: var(--shadow);
    margin-bottom: 30px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-header h2 {
    color: var(--dark);
    font-size: 22px;
  }
  
  .create-btn {
    background: var(--primary);
    color: var(--white);
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .create-btn:hover {
    background: var(--secondary);
    transform: translateY(-2px);
  }
  
  .diagrams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .diagram-card {
    background: var(--white);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
  }
  
  .diagram-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .diagram-preview {
    height: 160px;
    position: relative;
  }
  
  .diagram-placeholder {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: grid;
    place-items: center;
  }
  
  .diagram-placeholder::before {
    content: '';
    width: 60px;
    height: 60px;
    border: 3px dashed rgba(255, 255, 255, 0.5);
    border-radius: 8px;
  }
  
  .diagram-info {
    padding: 20px;
  }
  
  .diagram-info h3 {
    font-size: 18px;
    color: var(--dark);
    margin-bottom: 10px;
  }
  
  .diagram-meta {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--gray);
    margin-bottom: 15px;
  }
  
  .diagram-type {
    background: rgba(67, 97, 238, 0.1);
    color: var(--primary);
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 12px;
  }
  
  .diagram-actions {
    display: flex;
    gap: 10px;
  }
  
  .action-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .action-btn.edit {
    background: rgba(67, 97, 238, 0.1);
    color: var(--primary);
  }
  
  .action-btn.edit:hover {
    background: rgba(67, 97, 238, 0.2);
  }
  
  .action-btn.share {
    background: rgba(76, 201, 240, 0.1);
    color: var(--accent);
  }
  
  .action-btn.share:hover {
    background: rgba(76, 201, 240, 0.2);
  }
  
  .action-btn.more {
    background: rgba(239, 68, 68, 0.1);
    color: var(--danger);
    flex: none;
    width: 40px;
  }
  
  .action-btn.more:hover {
    background: rgba(239, 68, 68, 0.2);
  }
  
  .activity-feed {
    background: var(--white);
    border-radius: 15px;
    padding: 25px;
    box-shadow: var(--shadow);
  }
  
  .activity-list {
    list-style: none;
  }
  
  .activity-list li {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .activity-list li:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    background: var(--light-gray);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  
  .activity-content p {
    margin-bottom: 5px;
  }
  
  .activity-time {
    font-size: 12px;
    color: var(--gray);
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: var(--white);
    border-radius: 20px;
    width: 100%;
    max-width: 500px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  
  .modal-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .modal-header h3 {
    color: var(--dark);
  }
  
  .close-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--gray);
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--dark);
  }
  
  .modal-input {
    width: 100%;
    padding: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: var(--light-gray);
    font-size: 16px;
  }
  
  .template-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .template-card {
    padding: 20px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .template-card:hover {
    border-color: var(--primary);
    background: rgba(67, 97, 238, 0.05);
  }
  
  .modal-footer {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    border-top: 1px solid #e2e8f0;
  }
  
  .cancel-btn {
    background: transparent;
    border: 1px solid #e2e8f0;
    color: var(--gray);
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .cancel-btn:hover {
    background: var(--light-gray);
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .auth-card {
      max-width: 100%;
      margin: 20px;
    }
    
    .social-login {
      flex-direction: column;
    }
    
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
    }
    
    .sidebar-nav {
      display: flex;
      overflow-x: auto;
      padding: 0;
    }
    
    .nav-item {
      padding: 15px;
      white-space: nowrap;
    }
    
    .logout-btn {
      display: none;
    }
    
    .top-bar {
      padding: 15px;
    }
    
    .search-bar {
      width: 200px;
    }
    
    .diagrams-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(styles);

export default App;