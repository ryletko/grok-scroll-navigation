(function() {
  let processedMessages = new Set();
  let messageElements = new Map(); // Хранит пары текст:элемент
  let currentUrl = window.location.href;
  let navPanel;
  
  // Функция для очистки панели навигации
  const resetNavigation = () => {
    // Удаляем старую панель если она существует
    if (navPanel) {
      navPanel.remove();
    }
    
    // Сбрасываем данные
    processedMessages = new Set();
    messageElements = new Map();
    
    // Создаем новую панель
    navPanel = createNavPanel();
    
    // Обрабатываем уже существующие сообщения
    document.querySelectorAll('.message-bubble').forEach(processMessage);
  };
  
  // Создаем навигационную панель
  const createNavPanel = () => {
    const panel = document.createElement('div');
    panel.id = 'message-nav-panel';
    panel.style.cssText = `
      position: fixed;
      top: 70px;
      right: 50px;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 1;
      background-color: hsl(0, 0.00%, 97.30%);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 350px;
      display: none; /* Изначально скрываем панель */
      
      /* Стили для скроллбара */
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    `;
    
    // Стили для скроллбара в WebKit браузерах (Chrome, Safari)
    panel.innerHTML = `
      <style>
        #message-nav-panel::-webkit-scrollbar {
          width: 8px;
        }
        #message-nav-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        #message-nav-panel::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
      </style>
    `;
    
    document.body.appendChild(panel);
    return panel;
  };
  
  // Проверка изменения URL
  const checkUrlChange = () => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      resetNavigation();
    }
  };
  
  // Слушаем изменения истории (навигация в SPA)
  window.addEventListener('popstate', resetNavigation);
  
  // Периодически проверяем изменение URL (для случаев, когда popstate не срабатывает)
  setInterval(checkUrlChange, 1000);
  
  // Инициализируем панель
  navPanel = createNavPanel();
  
  // Создает кнопку навигации для сообщения
  const createNavButton = (text, element) => {
    const previewText = text.substring(0, 80) + (text.length > 80 ? '...' : '');
    const button = document.createElement('button');
    button.textContent = previewText;
    
    // Получаем цвет фона сообщения
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor || '#f9f9f9';
    
    button.style.cssText = `
      text-align: left;
      padding: 5px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: ${backgroundColor};
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 32px;
      min-height: 32px;
      flex-shrink: 0;
    `;
    button.addEventListener('click', () => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return button;
  };

  // Проверяет, есть ли сообщения в панели
  const updatePanelVisibility = () => {
    if (processedMessages.size > 0) {
      navPanel.style.display = 'flex';
      
      // Проверяем, нужен ли скролл
      setTimeout(() => {
        if (navPanel.scrollHeight > navPanel.clientHeight) {
          navPanel.style.overflowY = 'scroll';
        } else {
          navPanel.style.overflowY = 'auto';
        }
      }, 100);
    } else {
      navPanel.style.display = 'none';
    }
  };

  // Функция для обработки сообщения
  function processMessage(message) {
    // Получаем уникальный идентификатор сообщения (может быть любым атрибутом)
    const messageId = message.id || message.dataset.messageId || Date.now() + Math.random().toString(36).substring(2, 9);
    
    // Получаем текст сообщения, исключая содержимое div элементов
    let text = '';
    
    // Обходим все дочерние узлы сообщения
    message.childNodes.forEach(node => {
      // Добавляем текст только если это текстовый узел или не div элемент
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'div') {
        text += node.textContent;
      }
    });
    
    text = text.trim();
    
    // Создаем уникальный ключ, комбинируя текст и id сообщения
    const uniqueKey = `${messageId}:${text.substring(0, 100)}`;
    
    if (!processedMessages.has(uniqueKey)) {
      processedMessages.add(uniqueKey);
      messageElements.set(uniqueKey, message);
      
      // Создаем кнопку навигации
      const navButton = createNavButton(text, message);
      navPanel.appendChild(navButton);
      
      updatePanelVisibility(); // Показываем панель если она была скрыта
      
      console.log(text.substring(0, 80));
    }
  }

  // Функция для сканирования всех сообщений
  const scanAllMessages = () => {
    // Полностью очищаем навигационную панель
    const styleElement = navPanel.querySelector('style');
    navPanel.innerHTML = '';
    
    // Возвращаем стили скроллбара
    if (styleElement) {
      navPanel.appendChild(styleElement);
    }
    
    // Сбрасываем данные
    processedMessages = new Set();
    messageElements = new Map();
    
    // Сканируем заново все сообщения
    const messages = document.querySelectorAll('.message-bubble');
    
    // Отсортируем сообщения по их позиции в документе
    const sortedMessages = Array.from(messages).sort((a, b) => {
      const posA = a.getBoundingClientRect().top;
      const posB = b.getBoundingClientRect().top;
      return posA - posB;
    });
    
    // Обрабатываем сообщения в порядке их появления на странице
    sortedMessages.forEach(processMessage);
    
    // Обновляем отображение панели
    updatePanelVisibility();
  };

  // Обрабатываем уже существующие сообщения - начальное сканирование
  scanAllMessages();
  
  // Наблюдатель за изменениями в DOM
  const observer = new MutationObserver((mutations) => {
    let shouldRescan = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Если добавлен контейнер сообщения или сообщение
            if (node.classList && (
                node.classList.contains('message-container') || 
                node.querySelector('.message-bubble')
              )) {
              shouldRescan = true;
            }
          }
        });
      }
    });
    
    // Если обнаружены новые сообщения, пересканируем все
    if (shouldRescan) {
      scanAllMessages();
    }
  });

  // Настраиваем наблюдение за всем документом или конкретным контейнером
  const container = document.body; // Можно заменить на document.querySelector('.chat-area')
  observer.observe(container, { childList: true, subtree: true });
})();