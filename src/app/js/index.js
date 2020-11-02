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

downloadPath.innerText = slash(path.join(os.homedir(), 'websites'));

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!window.navigator.onLine) {
    return alert('You need an internet connection to perfom this task');
  }

  const websiteUrl = url.value;
  const websiteName = name.value;

  const output = slash(path.join(
    os.homedir(),
    `websites/${websiteName}`
  ));

  ipcRenderer.send('scrape:website', {
    websiteUrl,
    output
  });

  startLoader();
});

// On done
ipcRenderer.on('scraping:done', () => {
  shell.openPath(downloadPath.innerText);
  alert(`Website downloaded to ${downloadPath.innerText}/${name.value}`);
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
  fs.readdir(downloadPath.innerText, (err, files) => {
    if (files.length === 0) {
      alert('You have no downloads yet')
    } else {
      shell.openPath(downloadPath.innerText);
    }
  });
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