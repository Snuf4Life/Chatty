import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('chatty-title')
export class ChattyTitle extends LitElement {
  render() {
    return html`<h1>Chatty!</h1>`;
  }

  static styles = css`
    h1 {
      font-family: 'Luckiest Guy';
      margin: 0;
      font-size: 5rem;
      padding: 0;
      color: white;
      text-shadow: 0 0.1em 20px rgba(0, 0, 0, 1),
        0.05em -0.03em 0 rgba(0, 0, 0, 1), 0.05em 0.005em 0 rgba(0, 0, 0, 1),
        0em 0.08em 0 rgba(0, 0, 0, 1), 0.05em 0.08em 0 rgba(0, 0, 0, 1),
        0px -0.03em 0 rgba(0, 0, 0, 1), -0.03em -0.03em 0 rgba(0, 0, 0, 1),
        -0.03em 0.08em 0 rgba(0, 0, 0, 1), -0.03em 0 0 rgba(0, 0, 0, 1);
    }

    h1:hover {
      animation: chatty 1s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite
        alternate;
      user-select: none;
    }

    @keyframes chatty {
      0% {
        transform: scale(0.9);
      }
      80%,
      100% {
        transform: scale(1) rotateZ(-3deg);
      }
    }
  `;
}
