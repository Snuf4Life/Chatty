import { css } from 'lit';
export const scrollStyle = css`
  .scrollable {
    overflow: auto;
  }

  .scrollable::-webkit-scrollbar {
    width: 0.3rem;
  }

  .scrollable::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: var(--border-radius);
  }

  .scrollable:hover::-webkit-scrollbar-thumb {
    background-color: var(--outline-color);
  }
`;
