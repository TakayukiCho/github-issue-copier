function polling() {
  setTimeout(polling, 1000 * 30);
}

polling();

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({url: 'https://google.com'})
})
