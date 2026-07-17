const DEFAULT_CONFIG = {
  url: "http://localhost:3000/?salon_id=827610&hash=7666fafa5944d5a1fab5c1663bb3cadbd41781df",
  buttonText: "📋 Задачи"
};

async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['taskTrackerUrl', 'taskTrackerButtonText'], (result) => {
      const config = {
        url: result.taskTrackerUrl || DEFAULT_CONFIG.url,
        buttonText: result.taskTrackerButtonText || DEFAULT_CONFIG.buttonText
      };
      resolve(config);
    });
  });
}

window.getConfig = getConfig;