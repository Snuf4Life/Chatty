import { css } from 'lit';
export const inputStyle = css`
  input {
    border-radius: var(--border-radius-forms);
    border: 1px solid var(--outline-color);
    padding: 0.25rem 1rem;
    font-size: 1rem;
  }

  input::placeholder {
    color: var(--outline-color);
    opacity: 1;
  }

  input:focus {
    outline: none;
  }
`;
