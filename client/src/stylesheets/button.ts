import { css } from 'lit';
export const buttonStyle = css`
  button {
    padding: 0.25rem;
    border-radius: var(--border-radius-forms);
    color: var(--typography-color);
    cursor: pointer;

    transition: 0.5s;
  }

  button:disabled {
    cursor: not-allowed;
    color: #bcbcbc;
    opacity: 0.4;
  }
`;
