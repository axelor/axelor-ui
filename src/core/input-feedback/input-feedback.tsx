import styled from '../styled';
import { TVariant } from '../system';

export interface InputFeedbackProps {
  invalid?: boolean;
  color?: TVariant;
}

export const InputFeedback = styled.div<InputFeedbackProps>(({ invalid }) => [
  'form-text',
  { 'text-danger': invalid },
]);
