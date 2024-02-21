const USERNAME = 'Javier';
const URL = 'https://chat.arpanetos.lol/messages';
let messageToSend = '';

async function getMessages() {
  let messages = [];

  const response = await fetch(URL);
  messages = await response.json();
  messages = messages.reverse();
  console.log('messages: ', messages);

  // Styles
  const sidebarBackground = '#34495E';
  const darkChats = '#FFFFFF';

  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.fontFamily = 'Calibri';
  document.body.style.boxSizing = 'border-box';

  // Main Container
  let main = document.createElement('main');
  main.style.height = '100vh';
  main.style.display = 'flex';
  main.style.overflow = 'hidden';

  // Content
  let content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.height = '100vh';
  content.style.width = '100vh';

  // Navbar
  let navbar = document.createElement('div');
  navbar.style.height = '100px';
  navbar.style.width = '100%';
  navbar.style.backgroundColor = sidebarBackground;

  // Agregar el Navbar al Content
  content.appendChild(navbar);

  let chatsContainer = document.createElement('div');
  chatsContainer.style.width = '100%';
  chatsContainer.style.height = 'calc(100% - 60px)';
  chatsContainer.style.display = 'flex';
  chatsContainer.style.flexDirection = 'column';
  chatsContainer.style.backgroundColor = darkChats;

  // Contenedor para mostrar los mensajes
  let chatsContent = document.createElement('div');
  chatsContent.id = 'chatsContent';
  chatsContent.style.width = '100%';
  chatsContent.style.height = '100%';
  chatsContent.style.display = 'flex';
  chatsContent.style.flexDirection = 'column';
  chatsContent.style.padding = '20px';
  chatsContent.style.boxSizing = 'border-box';
  chatsContent.style.overflowY = 'auto';

  messages.forEach((item) => {
    let messageWrapper = document.createElement('div');
    messageWrapper.style.width = 'fit-content';
    messageWrapper.style.display = 'flex';
    messageWrapper.style.flexDirection = 'column';
    messageWrapper.style.padding = '0px 16px';
    messageWrapper.style.marginTop = '10px';
    messageWrapper.style.alignSelf = getMessageStyle(item).alignSelf;

    let messageHeader = document.createElement('div');
    messageHeader.style.display = 'flex';
    messageHeader.style.gap = '10px';
    messageHeader.style.justifyContent = 'flex-end';

    // Hora del mensaje
    let time = document.createElement('p');
    time.innerText = getFormatHour(new Date(item.created_at));
    time.style.margin = '0px';
    time.style.fontSize = '14px';
    time.style.color = '#808B96';

    let username = document.createElement('p');
    username.innerText = item.username === USERNAME ? 'Yo' : item.username;
    username.style.margin = '0px';
    username.style.color = '#000000';

    messageHeader.appendChild(time);
    messageHeader.appendChild(username);

    let messageBubble = document.createElement('div');
    messageBubble.style.width = 'fit-content';
    messageBubble.style.color = '#FFFFFF';
    messageBubble.style.display = 'flex';
    messageBubble.style.minHeight = '40px';
    messageBubble.style.alignItems = 'center';
    messageBubble.style.padding = '0px 16px';
    messageBubble.style.backgroundColor = getMessageStyle(item).backgroundColor;
    messageBubble.style.borderRadius = getMessageStyle(item).borderRadius;

    let message = document.createElement('p');
    message.innerText = item.message;

    messageBubble.appendChild(message);

    messageWrapper.appendChild(messageHeader);
    messageWrapper.appendChild(messageBubble);

    chatsContent.appendChild(messageWrapper);
  });

  let chatsFooter = document.createElement('div');
  chatsFooter.style.height = '60px';
  chatsFooter.style.width = '100%';
  chatsFooter.style.display = 'flex';
  chatsFooter.style.borderLeft = `2px solid ${darkChats}`;
  chatsFooter.style.backgroundColor = sidebarBackground;

  let chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.style.height = '40px';
  chatInput.style.width = '90%';
  chatInput.style.backgroundColor = darkChats;
  chatInput.style.borderRadius = '20px';
  chatInput.style.border = 'none';
  chatInput.style.outline = 'none';
  chatInput.style.margin = 'auto';
  chatInput.style.color = '#000000';
  chatInput.maxLength = 140;
  chatInput.style.padding = '0px 16px';

  chatInput.addEventListener('input', (event) => {
    messageToSend = event.target.value;
  });

  chatInput.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      sendMessage(messageToSend);

      // Limpiar el Input
      messageToSend = '';
      chatInput.value = '';
    }
  });

  chatsFooter.appendChild(chatInput);
  chatsContainer.appendChild(chatsContent);
  chatsContainer.appendChild(chatsFooter);
  content.appendChild(chatsContainer);
  main.appendChild(content);
  document.body.prepend(main);

  // Scroll siempre hasta abajo
  chatsContent.scrollTop = chatsContent.scrollHeight;
}

getMessages();

const getMessageStyle = (message) => {
  if (message.username === USERNAME) {
    return {
      backgroundColor: '#299CF2',
      borderRadius: '4px 0px 4px 4px',
      alignSelf: 'flex-end',
    };
  }
  return {
    backgroundColor: '#202328',
    borderRadius: '0px 4px 4px 4px',
    alignSelf: 'flex-start',
  };
};

const sendMessage = async (messageToSend) => {
  await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: USERNAME, message: messageToSend }),
  });

  let chatsContent = document.getElementById('chatsContent');
  chatsContent.scrollTop = chatsContent.scrollHeight;

  // getMessages();
};

function getFormatHour(fecha) {
  var horas = fecha.getHours();
  var minutos = fecha.getMinutes();
  var ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12;
  horas = horas ? horas : 12; // Si horas es 0, entonces es medianoche (12 AM)
  minutos = minutos < 10 ? '0' + minutos : minutos;
  var horaFormateada = horas + ':' + minutos + ' ' + ampm;
  return horaFormateada;
}
