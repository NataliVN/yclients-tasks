// content.js (обновленный)
(async function() {
  window.addEventListener('load', async () => {
    const config = await getConfig();
    
    const btn = document.createElement('div');
    btn.id = 'yc-task-btn';
    btn.innerText = config.buttonText;
    btn.title = 'Открыть задачник';
    
    const panel = document.createElement('div');
    panel.id = 'yc-task-panel';
    panel.style.display = 'none';
    
    const iframe = document.createElement('iframe');
    iframe.src = config.url;
    iframe.id = 'yc-task-iframe';
    
    const closeBtn = document.createElement('div');
    closeBtn.id = 'yc-task-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Закрыть';
    
    panel.appendChild(closeBtn);
    panel.appendChild(iframe);
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    
    btn.addEventListener('click', () => {
      const isHidden = panel.style.display === 'none';
      panel.style.display = isHidden ? 'flex' : 'none';
      btn.classList.toggle('active', isHidden);
    });
    
    closeBtn.addEventListener('click', () => {
      panel.style.display = 'none';
      btn.classList.remove('active');
    });
  });
})();