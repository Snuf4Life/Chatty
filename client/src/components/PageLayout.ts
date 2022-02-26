import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('page-layout')
export class PageLayout extends LitElement {
  static styles = css`
    div {
      margin: 0 auto;
      box-sizing: border-box;
      padding: 1rem;
      width: 65%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  `;

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}
