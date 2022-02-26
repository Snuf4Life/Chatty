import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

import { inputStyle } from '../stylesheets/input';
import { buttonStyle } from '../stylesheets/button';
import { MessageType } from '../models/Message';

@customElement('chat-input')
export class ChatInput extends LitElement {
  @state()
  _message: string = '';

  @state()
  _isMessagingDisabled: boolean = true;

  @state()
  _isQuestion: boolean = false;

  @property({ type: String })
  answeringMessageId?: string;

  constructor(answeringMessageId: string) {
    super();
    this.answeringMessageId = answeringMessageId;
    this._handleKeyup = this._handleKeyup.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    addEventListener('keyup', this._handleKeyup);
  }

  disconnectedCallback() {
    removeEventListener('keyup', this._handleKeyup);
    super.disconnectedCallback();
  }

  messageTypeIndicator() {
    if (!this.answeringMessageId)
      return html` <label
        for="question"
        class=${this._isQuestion ? 'checked' : ''}
      >
        <input
          type="checkbox"
          id="question"
          @change=${() => (this._isQuestion = !this._isQuestion)}
        />
        Mark as question
      </label>`;
    else
      return html` <label for="answer" class="checked">
        <input
          type="checkbox"
          id="answer"
          @change=${this._handleAnswerChange}
        />
        Marked as answer
      </label>`;
  }

  render() {
    return html`
      ${this.messageTypeIndicator()}
      <input
        placeholder="Enter you message here"
        type="text"
        .value=${this._message}
        @input="${this._onInput}"
      />
      <button
        ?disabled=${this._isMessagingDisabled}
        @click="${this._onMessageClick}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 0 24 24"
          width="36px"
          fill="currentColor"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"
          />
        </svg>
      </button>
    `;
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    if (name && name == '_message' && this._message !== oldValue) {
      this._isMessagingDisabled = this._message === '';
    }

    if (name && name == 'answeringMessageId') {
      this._isQuestion = false;
    }

    return super.requestUpdate(name, oldValue);
  }

  _onMessageClick() {
    if (!this._isMessagingDisabled) {
      this.dispatchEvent(
        new CustomEvent('onMessage', {
          detail: {
            text: this._message,
            type: this._getQuestionType(),
          },
          bubbles: true,
          composed: true,
        })
      );
      this._message = '';
      this._isQuestion = false;
    }
  }

  _getQuestionType() {
    if (!this.answeringMessageId && this._isQuestion)
      return MessageType.Question;
    if (this.answeringMessageId) return MessageType.Answer;
    return MessageType.General;
  }

  _handleAnswerChange() {
    this.dispatchEvent(
      new CustomEvent('onAnswerRemove', {
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleKeyup(e: KeyboardEvent) {
    if (e.key === 'Enter') this._onMessageClick();
  }

  _onInput(e: Event) {
    this._message = (e.target as HTMLInputElement).value;
  }

  static styles = [
    inputStyle,
    buttonStyle,
    css`
      :host {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        box-sizing: border-box;
      }

      button {
        display: flex;
        gap: 4px;
        background-color: transparent;
        border: none;
      }

      button > b {
        padding-top: 0.5rem;
        font-size: 1rem;
      }

      button:not([disabled]):hover {
        color: #66d366;
      }

      input[type='text'] {
        flex: 1;
      }

      input[type='checkbox'] {
        position: absolute;
        width: 1em;
        height: 1em;
        opacity: 0;
      }

      label {
        font-weight: bold;
        color: white;
        text-shadow: #0a081857 2px 2px 3px;
        align-self: center;
        cursor: pointer;
        transition: 0.5s ease-out;
      }

      label:not(.checked):hover {
        color: #49097e56;
        text-shadow: #0a081857 2px 3px 3px;
        transform: scale(1.1);
        animation: scaler 0.5s 0.7s infinite alternate;
      }

      label.checked {
        color: #49097e56;
        text-shadow: #0a081857 2px 3px 3px;
      }

      @keyframes scaler {
        0% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1.16);
        }
      }
    `,
  ];
}
