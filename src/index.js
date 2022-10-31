import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const inputValue = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info'); 
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const clean = clean => (clean.innerHTML = '');

const inputHandler = dataIn => {
    const inputText = dataIn.target.value.trim();
    if (!inputText) {
        clean(listCountry);
        clean(infoCountry);
        return;
  }
    fetchCountries(inputText)
        .then(data => {
            if (data.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
            } else {
                countryRender(data);
            }
        })
        .catch(error => {
            clean(listCountry);
            clean(infoCountry);
            Notify.failure("Oops, there is no country with that name.");
        });
}
    
const countryRender = data => {
    if (data.length === 1) {
        clean(listCountry);
        const info = countryInfo(data);
        infoCountry.innerHTML = info;
    } else {
        clean(infoCountry);
        const list = countryList(data);
        listCountry.innerHTML = list;
    }
}

const countryList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
}

const countryInfo = data => {
    return data
        .map(
            ({ name, capital, population, flags, languages }) =>
            `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
                name.official}</h1>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${Object.values(languages)}</p>`,
        )
}

inputValue.addEventListener("input", debounce(inputHandler, DEBOUNCE_DELAY));