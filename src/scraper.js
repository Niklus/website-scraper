const scrape = require("website-scraper");
const { ipcMain } = require("electron");
const SaveToExistingDirectoryPlugin = require("website-scraper-existing-directory");

module.exports = (mainWindow) => {
  ipcMain.on("scrape:website", (e, data) => {
    const { websiteUrl, output } = data;

    const options = {
      urls: [websiteUrl],
      directory: output,
      plugins: [new SaveToExistingDirectoryPlugin()],
    };

    scrape(options, (error, result) => {
      if (error) {
        mainWindow.webContents.send("error", error);
      } else {
        mainWindow.webContents.send("scraping:done");
      }
    });
  });
};
