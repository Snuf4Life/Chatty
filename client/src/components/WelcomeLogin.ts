import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { SocketController } from '../controllers/socket.js';
import { inputStyle } from '../stylesheets/input';
import { chattyButtonStyle } from '../stylesheets/chatty-button';

@customElement('welcome-login')
export class WelcomeLogin extends LitElement {
  _socketController = new SocketController(this);

  @state()
  _nickname: string = '';

  @state()
  _isBtnDisabled: boolean = true;

  @state()
  _error?: string | null;

  connectedCallback() {
    super.connectedCallback();

    this._socketController.socketInstance.on(
      'user-login-failed',
      (errorMessage: string) => {
        this._error = errorMessage;
      }
    );
  }

  render() {
    return html`
      <section>
        <h1 class="linear-wipe"><span>Hello</span><span>world!</span></h1>
        <h2>Welcome to my digital world.</h2>
        <p>
          I'm Chatty — a sophisticated AI bot with machine learning algorithms
          using only one "If" statement.
        </p>
        <p>I would love to chat with you, human.</p>
        <p>
          Please insert your preferred nickname (or name if you are a boomer
          😪).
        </p>
      </section>
      <form onsubmit="return false;">
        <input
          .value=${this._nickname}
          @input="${this._onInput}"
          type="text"
          placeholder="Enter you nickname"
        />
        <button ?disabled=${this._isBtnDisabled} @click=${this._onSubmit}>
          Enter
        </button>

        ${this._error
          ? html`<label class="error">${this._error}</label>`
          : null}
      </form>
    `;
  }

  requestUpdate(name?: PropertyKey, oldValue?: unknown) {
    if (name && name == '_nickname' && this._nickname !== oldValue) {
      this._isBtnDisabled = this._nickname === '';
      this._error = null;
    }
    return super.requestUpdate(name, oldValue);
  }

  _onInput(e: Event) {
    this._nickname = (e.target as HTMLInputElement).value;
  }

  _onSubmit() {
    if (this._nickname) {
      this._socketController.socketInstance.emit('user-login', this._nickname);
    }
  }

  static styles = [
    inputStyle,
    chattyButtonStyle,
    css`
      :host {
        margin-top: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        user-select: none;
      }

      section {
        margin-bottom: 3rem;
      }

      p {
        width: 70%;
        margin: 0.5rem auto;
      }

      p,
      button {
        font-size: 1.5rem;
      }

      button,
      input {
        text-align: center;
        flex: 1;
      }

      form {
        display: grid;
        grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) 0.5rem;
        gap: 0.4rem;
        height: 6rem;
      }

      form .error {
        color: #eb3e3eec;
        font-weight: bold;
      }

      h1 {
        font-family: 'Luckiest Guy';
        margin: 0;
        font-size: 6rem;
        padding: 0;
        color: white;
        text-shadow: 0 0.1em 20px rgba(0, 0, 0, 1),
          0.05em -0.03em 0 rgba(0, 0, 0, 1), 0.05em 0.005em 0 rgba(0, 0, 0, 1),
          0em 0.08em 0 rgba(0, 0, 0, 1), 0.05em 0.08em 0 rgba(0, 0, 0, 1),
          0px -0.03em 0 rgba(0, 0, 0, 1), -0.03em -0.03em 0 rgba(0, 0, 0, 1),
          -0.03em 0.08em 0 rgba(0, 0, 0, 1), -0.03em 0 0 rgba(0, 0, 0, 1);
      }

      span {
        transform: scale(0.9);
        display: inline-block;
      }
      span:first-child {
        animation: hello 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards
          infinite alternate;
      }
      span:last-child {
        animation: world 1s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)
          forwards infinite alternate;
      }

      @keyframes hello {
        0% {
          transform: scale(0.9);
        }
        50%,
        100% {
          transform: scale(1);
        }
      }

      @keyframes world {
        0% {
          transform: scale(0.9);
        }
        80%,
        100% {
          transform: scale(1) rotateZ(-3deg);
        }
      }
    `,
  ];
}
