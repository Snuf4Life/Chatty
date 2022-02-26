import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { User } from '../models/User.js';
import { MessageInput, Message, MessageType } from '../models/Message.js';
import { SocketController } from '../controllers/socket.js';

import './ChatInput.js';
import './ChatLobby.js';
import './ChatConversation.js';

@customElement('chat-app')
export class ChatApp extends LitElement {
  _socketController = new SocketController(this);

  @property({ type: Object })
  public currentUser: User;

  @state()
  _messages: Array<Message> = [];

  @state()
  _answeringMessage: { id: string; welcomeMessage?: Message } | null = null;

  constructor(currentUser: User) {
    super();
    this.currentUser = currentUser;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this._socketController.socketInstance.on(
      'all-message',
      (message: Message) => this._appendMessage(message)
    );

    this._socketController.socketInstance.on(
      'broadcast-message',
      (message: Message) => this._appendMessage(message)
    );

    this._socketController.socketInstance.on(
      'self-message',
      (message: Message) => this._appendMessage(message)
    );
  }

  render() {
    return html`
      <chat-looby .currentUser=${this.currentUser}> </chat-looby>
      <div class="chat">
        <chat-conversation
          .messages=${this._messages}
          .currentUser=${this.currentUser}
          .answeringMessageId=${this._answeringMessage?.id}
          @onAnswer=${this._handleOnAnswer}
        >
        </chat-conversation>
        <chat-input
          .answeringMessageId=${this._answeringMessage?.id}
          @onMessage=${this._onMessage}
          @onAnswerRemove=${() => (this._answeringMessage = null)}
        >
        </chat-input>
      </div>
    `;
  }

  _handleOnAnswer(e: CustomEvent) {
    this._answeringMessage = e.detail;
  }

  _onMessage(e: CustomEvent) {
    const { text, type } = e.detail;
    let message: MessageInput = {
      text,
      user: this.currentUser,
      type,
    };

    if (type === MessageType.Answer && this._answeringMessage) {
      if (this._answeringMessage.welcomeMessage) {
        this._socketController.socketInstance.emit('welcome-message', {
          ...message,
          answeredQuestion: this._answeringMessage.welcomeMessage,
        });

        this._answeringMessage = null;
        return;
      }

      message.answeredMessageId = this._answeringMessage.id;
      this._answeringMessage = null;
    }

    this._socketController.socketInstance.emit('user-message', message);
  }

  _appendMessage(message: Message) {
    this._messages = [...this._messages, message];
  }

  static styles = css`
    :host {
      box-sizing: border-box;
      height: 80vh;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      border-top: 1px solid var(--light-border-color);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-color) 0px 5px 5px 1px;

      --input-hight: 80px;
    }

    chat-looby {
      height: 100%;
      width: 30%;
      box-shadow: var(--shadow-color) 6px 4px 10px -3px;
      background-color: var(--bg-primary-color);
      border-bottom-left-radius: var(--border-radius);
      border-top-left-radius: var(--border-radius);
      z-index: 1;
    }

    .chat {
      display: flex;
      flex-direction: column;
      width: 70%;
      height: 100%;
      justify-content: space-between;
    }

    .chat > chat-input {
      height: var(--input-hight);
      background-color: var(--bg-primary-color);
      border-top: 1px solid var(--outline-color);
      border-bottom-right-radius: var(--border-radius);
    }

    .chat > chat-conversation {
      height: calc(100% - var(--input-hight));
    }
  `;
}
