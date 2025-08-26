import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/UI/Button';

const DashboardContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f8f9fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;

  h1 {
    font-size: 28px;
    margin-bottom: 8px;
    color: #212529;
  }

  p {
    color: #6c757d;
    font-size: 16px;
  }
`;

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <DashboardContainer>
      <WelcomeSection>
        <UserAvatar>
          <img src={user?.avatar || 'https://i.pravatar.cc/150?img=3'} alt="User" />
        </UserAvatar>
        <UserInfo>
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p>You're logged in as {user?.email}</p>
        </UserInfo>
        <Button 
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ width: 'auto', padding: '12px 24px' }}
        >
          Logout
        </Button>
      </WelcomeSection>

      <div>
        <h2 style={{ marginBottom: '20px', color: '#212529' }}>Your Projects</h2>
        {/* Add your dashboard content here */}
      </div>
    </DashboardContainer>
  );
};