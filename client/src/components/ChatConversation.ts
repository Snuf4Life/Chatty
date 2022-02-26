import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { Message, MessageType } from '../models/Message';
import { UserType, User } from '../models/User';
import { scrollStyle } from '../stylesheets/scroll.js';
import { chattyButtonStyle } from '../stylesheets/chatty-button';

@customElement('chat-conversation')
export class ChatConversation extends LitElement {
  @property({ type: Object })
  currentUser: User;

  @property({ type: Array })
  messages: Message[];

  @property({ type: String })
  answeringMessageId?: string;

  @state()
  _messageToShowQuestion?: Message | null;

  constructor(
    currentUser: User,
    messages: Message[],
    answeringMessageId: string
  ) {
    super();
    this.currentUser = currentUser;
    this.messages = messages;
    this.answeringMessageId = answeringMessageId;
  }

  answerButton(message: Message) {
    const isQuestionMessage =
      message.type === MessageType.Question &&
      message.user.id !== this.currentUser.id;
    const isWelcomeMessage = message.type === MessageType.Welcome;

    if (isQuestionMessage || isWelcomeMessage)
      return html`<div class="answer-action">
        <button @click=${() => this._handleAnswer(message)}>
          ${message.id === this.answeringMessageId ? 'Answering...' : 'Answer'}
        </button>
      </div>`;
  }

  showAnsweredQuestion(message: Message) {
    console.log('message', message, this._messageToShowQuestion);
    // I could made this section with expend animation.
    // this was  made at 23:21 after really long day with 3 hours of sleep the night before. ¯\_(ツ)_/¯
    if (message.answeredQuestion) {
      console.log(
        'show',
        this._messageToShowQuestion &&
          message.id === this._messageToShowQuestion.id
      );
      if (
        this._messageToShowQuestion &&
        message.id === this._messageToShowQuestion.id
      ) {
        return html`<div class="answered-question">
          <h4>
            ${message.answeredQuestion.user.username}
            ${message.answeredQuestion.user.type === UserType.Bot
              ? html`<small>(Bot)</small>`
              : null}
          </h4>
          <p>${message.answeredQuestion.text}</p>
          <button
            @click=${() => this._handleShowQuestionClick(<Message>message)}
            class="expend-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 0 24 24"
              width="16px"
              fill="#FFFFFF"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" />
            </svg>
          </button>
        </div>`;
      } else {
        return html`<button
          @click=${() => this._handleShowQuestionClick(<Message>message)}
          class="expend-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 20 20"
            height="16px"
            viewBox="0 0 20 20"
            width="16px"
            fill="#FFFFFF"
          >
            <g><rect fill="none" height="20" width="20" x="0" /></g>
            <g>
              <path
                d="M9.29,10.58c0.6-1.07,1.73-1.7,2.39-2.65c0.7-0.99,0.31-2.85-1.67-2.85c-1.3,0-1.94,0.98-2.2,1.8l-2-0.84 C6.35,4.41,7.83,3,9.99,3c1.81,0,3.05,0.82,3.68,1.85c0.54,0.88,0.86,2.54,0.02,3.77c-0.92,1.36-1.81,1.78-2.28,2.65 c-0.19,0.35-0.27,0.58-0.27,1.72H8.91C8.91,12.4,8.82,11.42,9.29,10.58z M11.5,16c0,0.83-0.67,1.5-1.5,1.5 c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5C10.83,14.5,11.5,15.17,11.5,16z"
              />
            </g>
          </svg>
        </button>`;
      }
    }
  }

  render() {
    return html`
      <div class="container scrollable">
        <ul>
          ${repeat(
            this.messages,
            message => message.id,
            message => {
              // I would make this into a ChatMessage component.
              return html`
                <li
                  class="${message.user.type !== UserType.Bot &&
                  message.user.id === this.currentUser?.id
                    ? 'me'
                    : ''}"
                >
                  <section>
                    <h4>
                      ${message.user.username}
                      ${message.user.type === UserType.Bot
                        ? html`<small>(Bot)</small>`
                        : null}
                    </h4>
                    <p>${message.text}</p>
                    ${this.answerButton(message)}
                    ${this.showAnsweredQuestion(message)}
                  </section>
                  <small> ${this._formatDate(message.timestamp)}</small>
                </li>
              `;
            }
          )}
        </ul>
      </div>
    `;
  }

  _handleShowQuestionClick(message: Message) {
    if (message.id === this._messageToShowQuestion?.id)
      this._messageToShowQuestion = null;
    else this._messageToShowQuestion = message;
  }

  _handleAnswer(message: Message) {
    const isWelcomeMessage = message.type === MessageType.Welcome;

    this.dispatchEvent(
      new CustomEvent('onAnswer', {
        detail: {
          id: this.answeringMessageId === message.id ? null : message.id,
          welcomeMessage: isWelcomeMessage ? message : null,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _formatDate(ms: number) {
    return new Date(ms).toLocaleDateString('en', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static styles = [
    chattyButtonStyle,
    scrollStyle,
    css`
      :host {
        --x-padding: 2.5rem;
        --message-border-radius: 20px;

        display: flex;
        box-sizing: border-box;

        padding: 2rem var(--x-padding);
        position: relative;
      }

      :host::before {
        content: '';
        box-sizing: border-box;
        background: linear-gradient(to bottom, white 30%, transparent);
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        height: 6rem;
        width: 100%;
      }

      .container {
        width: 100%;
        display: flex;
        width: 100%;
        flex-direction: column-reverse;
      }

      ul {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 1.5rem;
      }

      li {
        display: flex;
        width: fit-content;
        flex-direction: column;
        gap: 1rem;
        align-self: flex-end;
        margin: 0.25rem;
        animation: message 0.4s ease-out forwards;
        max-width: 65%;
      }

      li:first-child {
        margin-top: 1rem;
      }

      li.me {
        align-self: flex-start;
      }

      li.me section {
        box-shadow: var(--shadow-color) 2px 5px 5px 0px;
        background-color: #d1d1de54;
        border-bottom-left-radius: unset;
        border-bottom-right-radius: var(--message-border-radius);
      }

      section {
        position: relative;
        border: 1px solid var(--light-border-color);
        border-radius: var(--message-border-radius);
        border-bottom-right-radius: unset;
        padding: 1rem 0.5rem;
        box-shadow: var(--shadow-color) -2px 5px 5px 0px;
      }

      .answered-question {
        margin: 1rem;
        border: 1px solid;
        border-radius: 20px;
        padding: 0.5rem;
        border-bottom-right-radius: 0;
        background: #fffdece0;
      }

      .expend-button {
        padding: 0px;
        border-radius: 36px;
        height: 18px;
        width: 18px;
        position: absolute;
        bottom: -8px;
        left: -8px;
      }

      li.me .expend-button {
        right: -8px;
        left: unset;
      }

      li.me .answered-question {
        background: white;
      }

      @keyframes message {
        0% {
          transform: scale(0.5);
        }
        100% {
          transform: scale(1);
        }
      }

      h4 {
        color: #5d88d8ed;
        margin: 0;
        margin-bottom: 0.5rem;
      }

      p {
        margin: 0;
        margin-bottom: 0.25rem;
        white-space: pre-wrap;
      }

      small {
        margin: 0px 0.5rem;
        color: #979797;
        font-size: 0.75rem;
      }

      .answer-action {
        display: flex;
        justify-content: center;
        padding: 0.5rem;
      }
    `,
  ];
}
