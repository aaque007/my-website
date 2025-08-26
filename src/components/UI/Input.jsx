import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-bottom: 16px;

  &:focus {
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;