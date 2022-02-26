import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { SocketController } from '../controllers/socket.js';
import { User, UserType } from '../models/User.js';
import { scrollStyle } from '../stylesheets/scroll.js';

@customElement('chat-looby')
export class ChatLobby extends LitElement {
  _socketController = new SocketController(this);

  @property({ type: Object })
  currentUser: User;

  @state()
  _users: User[] = [];

  constructor(currentUser: User) {
    super();
    this.currentUser = currentUser;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this._socketController.socketInstance.on(
      'connected-users',
      (users: User[]) => {
        this._users = users;
      }
    );
  }

  render() {
    return html`
      <div class="container">
        <h2>Friends of Chatty</h2>
        <div class="users-container scrollable">
          <ul>
            ${repeat(
              this._users,
              user => user.id,
              user => {
                const isMe =
                  user.type === UserType.User &&
                  user.id === this.currentUser?.id;
                const isBot = user.type === UserType.Bot;
                return html`
                  <li class=${isMe ? 'me' : ''}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 0 24 24"
                      width="18px"
                      fill="currentColor"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path
                        d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 9c2.7 0 5.8 1.29 6 2v1H6v-.99c.2-.72 3.3-2.01 6-2.01m0-11C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                    ${user.username} ${isMe ? '(me)' : null}
                    ${isBot ? '(bot)' : null}
                  </li>
                `;
              }
            )}
          </ul>
        </div>
      </div>
    `;
  }

  static styles = [
    scrollStyle,
    css`
      :host {
        height: 100%;
        display: flex;
        box-sizing: border-box;
        padding: 1rem 1.5rem 3rem 1rem;
      }

      .container {
        display: flex;
        width: 100%;
        flex-direction: column;
      }

      .users-container {
        height: 100%;

        border: 1px solid var(--outline-color);
        border-radius: var(--border-radius);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        background-color: white;
      }

      ul {
        padding: 0 1rem;
      }

      li {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      li.me {
        color: #5020c0;
      }
    `,
  ];
}
