import styled from '../styled';

export interface InputProps {
  intermediate?: boolean;
  invalid?: boolean;
}

const formClass = (type: string) => {
  switch (type) {
    case 'checkbox':
    case 'radio':
      return 'form-check-input';
    case 'range':
      return 'form-range';
    case 'color':
      return 'form-control-color';
    default:
      return 'form-control';
  }
};

export const Input = styled.input<InputProps>(
  ({ type = 'text', invalid }) => [formClass(type), { 'is-invalid': invalid }],
  ({ type = 'text' }) => ({ type })
);
