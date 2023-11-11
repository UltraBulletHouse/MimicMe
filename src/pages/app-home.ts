import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {
  static styles = [
    styles,
    css`
    #home {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height:100%;
    }

    #title {
      color: var(--sl-color-yellow-300);
      text-shadow: 0px 0px 20px #0000008a;
    }

    sl-button::part(base)  {
      background-color: var(--sl-color-yellow-300);
      box-shadow: 0px 0px 20px 0px #00000059;
      margin-top: 100px;
    }

    sl-button::part(label) {
      font-weight: bold;
    }
  `];

  render() {
    return html`
      <main>
        <div id="home">
          <h2 id="title">What animal are you today?</h2>
          <sl-button href="${resolveRouterPath('animal')}" pill>Let's check!</sl-button>
        </div>
      </main>
    `;
  }
}
