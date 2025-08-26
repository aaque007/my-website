import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext'; // Now this will work

const HeaderContainer = styled.header`
  background: #4361ee;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header = () => {
  const { user, logout } = useAuth(); // Properly imported now

  return (
    <HeaderContainer>
      <h1>Design Pro</h1>
      <nav>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Welcome, {user.name}</span>
            <button onClick={logout} style={{
              background: 'white',
              color: '#4361ee',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </HeaderContainer>
  );
};