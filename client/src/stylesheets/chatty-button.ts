import { css } from 'lit';
import { buttonStyle } from './button';

export const chattyButtonStyle = [
  buttonStyle,
  css`
    button {
      background: #707ecc;
      color: white;
      border: 1px solid var(--outline-color);
      cursor: pointer;
    }

    button:hover {
      animation: scaler 0.1s ease forwards;
    }

    button:active {
      animation: clicker 0.1s ease forwards;
    }

    button[disabled] {
      animation: none;
    }

    @keyframes scaler {
      100% {
        transform: translateY(-2px);
        backface-visibility: hidden;
        will-change: transform;
        box-shadow: #42424240 0px 2px 0px 0px;
      }
    }

    @keyframes clicker {
      100% {
        transform: translateY(0);
        backface-visibility: hidden;
        box-shadow: unset;
      }
    }
  `,
];
