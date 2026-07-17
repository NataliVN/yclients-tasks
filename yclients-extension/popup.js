// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  // Загружаем текущие настройки
  const config = await new Promise((resolve) => {
    chrome.storage.sync.get(['taskTrackerUrl', 'taskTrackerButtonText'], (result) => {
      resolve({
        url: result.taskTrackerUrl || 'http://localhost:3000/?salon_id=827610&hash=test',
        buttonText: result.taskTrackerButtonText || '📋 Задачи'
      });
    });
  });

  document.getElementById('urlInput').value = config.url;
  document.getElementById('buttonTextInput').value = config.buttonText;

  // Сохранение настроек
  document.getElementById('saveBtn').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    const buttonText = document.getElementById('buttonTextInput').value.trim();

    chrome.storage.sync.set({
      taskTrackerUrl: url,
      taskTrackerButtonText: buttonText
    }, () => {
      const status = document.getElementById('status');
      status.style.display = 'block';
      setTimeout(() => { status.style.display = 'none'; }, 2000);
    });
  });
});