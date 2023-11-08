import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() name = 'Laura';

  static styles = [
    styles,
    css`
    #welcome-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    #title {
      color: var(--sl-color-amber-300);
      text-shadow: 0px 0px 20px #0000008a;
    }

    sl-button::part(base)  {
      background-color: var(--sl-color-amber-300);
      box-shadow: 0px 0px 20px 0px #00000059;
      margin-top: 100px;
    }

    sl-button::part(label) {
      font-weight: bold;
    }

    @media(min-width: 750px) {
      sl-card {
        width: 70vw;
      }
    }

    @media (horizontal-viewport-segments: 2) {
      #welcome-bar {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
      }
    }
  `];

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');
  }


  render() {
    return html`
      <app-header></app-header>

      <main>
        <div id="welcome-bar">
          <h2 id="title">What animal are you today?</h2>
          <sl-button href="${resolveRouterPath('about')}" pill>Let's check!</sl-button>
        </div>
      </main>
    `;
  }
}
