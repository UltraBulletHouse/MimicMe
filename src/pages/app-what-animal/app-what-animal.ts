import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { styles } from '../../styles/shared-styles'
import animalsList from "../../database/animals.json";
import { getRandom } from '../../helpers/getRandom';
import { getStoredAnimal } from '../../utils/getStoredAnimal';

@customElement('app-what-animal')
export class AppWhatAnimal extends LitElement {
  static styles = [
    styles,
    css`
    #container {
      height: 100%;
    }
    #expiration-wrapper {
      display: flex;
      justify-content: center;
      padding: 10px;
    }
    #expiration-time {
      color: var(--sl-color-lime-300);
      text-shadow: 0px 0px 20px #0000008a;
    }
    #content {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      height: 80%;
    }
    #title{
      color: var(--sl-color-yellow-300);
      text-shadow: 0px 0px 20px #0000008a;
    }
    #animal-image {
      height: 250px;
    }
    #animal-features {
      color: var(--sl-color-yellow-200);
      text-shadow: rgb(0 0 0) 0px 0px 4px;
      padding: 20px 20px 0px;
    }
    #animal-feature-item {
      margin-top: 10px;
    }
    #button-container{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    sl-button::part(base)  {
      background-color: var(--sl-color-yellow-300);
      box-shadow: 0px 0px 20px 0px #00000059;
    }
    sl-button::part(label) {
      font-weight: bold;
    }
  `];

  @property() randomNumber = 10
  @property() animal = getStoredAnimal() || animalsList.animals[this.randomNumber];
  @property() expiresText = '';
  @property() expirationTimeInMs: number = 24 * 60 * 60 * 1000;//24 * 60 * 60 * 1000 (dla testów 5 sekund cache jest zwalidowany, produkcyjnie zmienimy do 24h)

  private usedAnimalIndices: number[] = [];

  updateRandom = () => {
    if (this.usedAnimalIndices.length === animalsList.animals.length) {
      this.usedAnimalIndices = [];
    }

    let newIndex: number;

    do {
      newIndex = getRandom(animalsList.animals.length);
    } while (this.usedAnimalIndices.includes(newIndex));

    this.usedAnimalIndices.push(newIndex);

    this.randomNumber = newIndex;
    this.animal = animalsList.animals[this.randomNumber];
    this.storeAnimal();
    this.storeUsedIndices();
    this.calculateExpirationTime();
  }

  calculateExpirationTime() {
    const currentTime = new Date().getTime();
    const expirationTime = this.getExpirationTime();
    const remainingTime = expirationTime - currentTime;

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    let expiresText = "New animal in ";

    if (hours > 0) {
      expiresText += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
      expiresText += `${minutes}m `;
    }

    if (seconds > 0 || (minutes === 0 && hours === 0)) {
      expiresText += `${seconds}s`;
    }

    this.expiresText = expiresText.trim();
  }

  getExpirationTime() {
    const storedAnimal = getStoredAnimal();
    return storedAnimal ? storedAnimal.timestamp : 0;
  }

  connectedCallback() {
    super.connectedCallback()
    const storedUsedIndices = this.getStoredUsedIndices();
    if (storedUsedIndices) {
      this.usedAnimalIndices = storedUsedIndices;
    }
    const storedAnimal = getStoredAnimal();
    if (storedAnimal && this.isStoredAnimalValid(storedAnimal)) {
      this.animal = storedAnimal;
      this.calculateExpirationTime();
    } else {
      this.updateAnimal();
    }

    setInterval(() => {
      this.updateAnimal();
    }, 1000);
  }

  updateAnimal() {
    const currentTime = new Date().getTime();
    const expirationTime = this.getExpirationTime();
    const remainingTime = expirationTime - currentTime;
    if (remainingTime <= 0) {
      this.updateRandom();
    } else {
      this.calculateExpirationTime();
    }
  }

  getStoredUsedIndices() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('usedAnimalIndices=')) {
        return JSON.parse(cookie.substring('usedAnimalIndices='.length, cookie.length));
      }
    }
    return null;
  }

  storeAnimal() {
    const expirationDate = new Date(new Date().getTime() + this.expirationTimeInMs);
    document.cookie = `chosenAnimal=${JSON.stringify({ ...this.animal, timestamp: expirationDate.getTime() })}; expires=${expirationDate.toUTCString()}; path=/`;
  }

  storeUsedIndices() {
    document.cookie = `usedAnimalIndices=${JSON.stringify(this.usedAnimalIndices)}; path=/`;
  }

  isStoredAnimalValid(storedAnimal: any) {
    const timestamp = storedAnimal.timestamp;
    const currentTime = new Date().getTime();
    return currentTime - timestamp < this.expirationTimeInMs;
  }

  getImageUrl(name: string) {
    return new URL(`../../images/animals/${name}`, import.meta.url).href
  }

  render() {
    return html`
      <main>
        <div id="container">
        <div id="expiration-wrapper">
          <div id="expiration-time">${this.expiresText}</div>
        </div>
          <div id="content">
            <h2 id=title>Today you are ${this.animal.name}</h2>
            <img id="animal-image" src="${this.getImageUrl(this.animal.image)}" alt="${this.animal.name}" />
            <div id="animal-features" >
            ${this.animal.features.map((item: any) => html`<h4 id="animal-feature-item">👉 ${item}</h4>`)}
            </div>
          </div>

          <amp-ad width="100vw" height="320"
          type="adsense"
          data-ad-client="ca-pub-9649063342759771"
          data-ad-slot="4533552082"
          data-auto-format="rspv"
          data-full-width="">
         <div overflow=""></div>
        </amp-ad>
        </div>
      </main>
    `;
  }
}
