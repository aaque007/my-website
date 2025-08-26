import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Button = styled(motion.button)`
  background: ${({ primary }) => (primary ? '#4361ee' : 'transparent')};
  color: ${({ primary }) => (primary ? 'white' : '#4361ee')};
  border: ${({ primary }) => (primary ? 'none' : '1px solid #4361ee')};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 16px;

  &:hover {
    background: ${({ primary }) => (primary ? '#3a56d4' : 'rgba(67, 97, 238, 0.1)')};
  }

  &:disabled {
    background: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
  }
`;