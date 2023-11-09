import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// You can also import styles from another file
// if you prefer to keep your CSS seperate from your component
import { styles } from './about-styles';

// import { styles as sharedStyles } from '../../styles/shared-styles'

import '@shoelace-style/shoelace/dist/components/card/card.js';


import animalsList from "../../database/animals.json";
import { getRandom } from '../../helpers/getRandom';
console.log(animalsList);

@customElement('app-what-animal')
export class AppWhatAnimal extends LitElement {
  static styles = [
    styles,
    css`
    #wrapper {
      height: 100%;
    }
    main {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      margin:0;
    }
    footer {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    sl-button::part(base)  {
      background-color: var(--sl-color-amber-300);
      box-shadow: 0px 0px 20px 0px #00000059;
    }
    sl-button::part(label) {
      font-weight: bold;
    }
    #title{
      color: var(--sl-color-amber-300);
      text-shadow: 0px 0px 20px #0000008a;
    }
    #animal-image {
      height: 250px;
    }
    #animal-features {
      color: var(--sl-color-amber-200);
      text-shadow: rgb(0 0 0) 0px 0px 4px;
      padding: 20px 20px 0px;
    }
    #animal-feature-item {
      margin-top: 10px;
    }
  `];

  @property() randomNumber = 10
  @property() animal = animalsList.animals[this.randomNumber]

  updateRandom = () => {
      this.randomNumber = getRandom(animalsList.animals.length -1);
      this.animal = animalsList.animals[this.randomNumber]
  }

  connectedCallback() {
    super.connectedCallback()
    this.randomNumber = getRandom(animalsList.animals.length -1);
    this.animal = animalsList.animals[this.randomNumber];
  }

   getImageUrl(name: string) {
    return new URL(`../../images/animals/${name}`, import.meta.url).href
  }

  render() {
    return html`
    <div id="wrapper">
      <app-header ?enableBack="${true}"></app-header>

      <main>
         <h2 id=title>Today you are ${this.animal.name}</h2>
         <img id="animal-image" src="${this.getImageUrl(this.animal.image)}" alt="${this.animal.name}" />
        <div id="animal-features" >
          ${this.animal.features.map(item => html`<div id="animal-feature-item">👉 ${item}</div>`)}
        </div>
      </main>
      <footer>
      <sl-button pill @click="${this.updateRandom}">Try again!</sl-button>
      </footer>
    </div>
    `;
  }
}
