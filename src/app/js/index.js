const { ipcRenderer, shell } = require('electron');
const os = require('os');
const path = require('path');
const slash = require('slash');
const fs = require('fs');

const form = document.querySelector('form');
const url = document.querySelector('#url');
const name = document.querySelector('#name');
const downloadPath = document.querySelector('#downloads');
const openBtn = document.querySelector('#open-sites');
const loader = document.querySelector('.display-middle');
const downloadBtn = document.querySelector('.submit');

const websitesDir = slash(path.join(os.homedir(), 'websites'));

// Create website directory if doesnt already exists
if (!fs.existsSync(websitesDir)){
  fs.mkdirSync(websitesDir);
}

downloadPath.innerText = websitesDir;

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!window.navigator.onLine) {
    return alert('You need an internet connection to perfom this task');
  }
  
  if (url.value && name.value) {

    const websiteUrl = url.value;
    const websiteName = name.value;

    const output = `${websitesDir}/${websiteName}`;

    ipcRenderer.send('scrape:website', {
      websiteUrl,
      output
    });

    startLoader();
  } else {
    alert('Value(s) misssing');
  }
});

// On done
ipcRenderer.on('scraping:done', () => {
  shell.openPath(websitesDir);
  alert(`Website downloaded to ${websitesDir}/${name.value}`);
  url.value = '';
  name.value = '';
  stopLoader();
});

// On Error
ipcRenderer.on('error', (event, error) => {
  alert(error.message || 'Error: check your internet connection');
  stopLoader();
});

openBtn.addEventListener('click', () => {
  shell.openPath(websitesDir);
});

function startLoader() {
  loader.classList.remove('hideContent');
  downloadBtn.classList.add('hideContent');
  url.setAttribute('disabled', true);
  name.setAttribute('disabled', true);
}

function stopLoader() {
  loader.classList.add('hideContent');
  downloadBtn.classList.remove('hideContent');
  url.removeAttribute('disabled');
  name.removeAttribute('disabled');
}