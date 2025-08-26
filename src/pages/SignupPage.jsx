import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h2 {
    color: #212529;
    font-size: 28px;
    margin-bottom: 8px;
  }

  p {
    color: #6c757d;
    font-size: 16px;
  }
`;

const iconStyle = {
  position: 'absolute',
  left: '16px',
  top: '14px',
  color: '#adb5bd'
};

export const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      login({ 
        name: formData.name, 
        email: formData.email,
        avatar: `https://i.pravatar.cc/150?u=${formData.email}`
      });
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <AuthCard>
        <AuthHeader>
          <h2>Create Your Account</h2>
          <p>Join us to start creating amazing designs</p>
        </AuthHeader>
        
        {error && <div style={{ color: '#e63946', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSignup}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <FontAwesomeIcon icon={faUser} style={iconStyle} />
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <FontAwesomeIcon icon={faEnvelope} style={iconStyle} />
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <FontAwesomeIcon icon={faLock} style={iconStyle} />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              minLength="6"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <FontAwesomeIcon icon={faLock} style={iconStyle} />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              style={{ paddingLeft: '40px' }}
            />
          </div>
          
          <Button
            type="submit"
            primary
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', color: '#6c757d' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#4361ee', fontWeight: '600' }}>
            Sign in
          </a>
        </div>
      </AuthCard>
    </SignupContainer>
  );
};