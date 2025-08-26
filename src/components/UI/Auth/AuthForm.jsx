import { useState } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

export const AuthForm = ({ type, onSubmit, loading }) => {
  const [formData, setFormData] = useState(
    type === 'login'
      ? { email: '', password: '' }
      : { name: '', email: '', password: '', confirmPassword: '' }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === 'signup' && (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <FontAwesomeIcon
            icon={faUser}
            style={{
              position: 'absolute',
              left: '16px',
              top: '14px',
              color: '#adb5bd',
            }}
          />
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ paddingLeft: '40px' }}
          />
        </div>
      )}
      
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FontAwesomeIcon
          icon={faEnvelope}
          style={{
            position: 'absolute',
            left: '16px',
            top: '14px',
            color: '#adb5bd',
          }}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ paddingLeft: '40px' }}
        />
      </div>
      
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <FontAwesomeIcon
          icon={faLock}
          style={{
            position: 'absolute',
            left: '16px',
            top: '14px',
            color: '#adb5bd',
          }}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
          style={{ paddingLeft: '40px' }}
        />
      </div>
      
      {type === 'signup' && (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <FontAwesomeIcon
            icon={faLock}
            style={{
              position: 'absolute',
              left: '16px',
              top: '14px',
              color: '#adb5bd',
            }}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ paddingLeft: '40px' }}
          />
        </div>
      )}
      
      <Button
        type="submit"
        primary
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
      >
        {loading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
};