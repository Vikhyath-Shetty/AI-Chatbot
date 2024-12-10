const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");

//rendering the session history
renderHistory();

sendBtn.addEventListener("click", startChat);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") startChat();
});

function renderPrompt(prompt) {
  const userMessage = document.createElement("li");
  userMessage.classList.add("message", "user-message");
  userMessage.textContent = prompt;
  chatMessages.appendChild(userMessage);
}

function renderResponse(message) {
  const botMessageEl = document.createElement("li");
  botMessageEl.classList.add("message", "bot-message");
  botMessageEl.innerHTML = message;
  chatMessages.appendChild(botMessageEl);
}

function saveToStorage(prompt, message) {
  const history = sessionStorage.getItem("chatHistory");
  const array = history ? JSON.parse(history) : [];
  array.push({ prompt, message });
  sessionStorage.setItem("chatHistory", JSON.stringify(array));
}

function renderHistory() {
  const history = sessionStorage.getItem("chatHistory");
  if (!history) return;
  const historyArr = JSON.parse(history);
  historyArr.forEach(({ prompt, message }) => {
    renderPrompt(prompt);
    renderResponse(message);
  });
}

function sendPrompt(prompt) {
  return fetch("http://localhost:5001/api/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
    .then((response) => response.json())
    .then((data) => data.message);
}

async function startChat() {
  const prompt = messageInput.value.trim();
  if (prompt === "") return;

  // rendering the user message
  renderPrompt(prompt);

  // sending the request to backend
  const message = await sendPrompt(prompt);

  // rendering the api response
  renderResponse(message);

  // Clear input and scroll to bottom
  messageInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  //save to storage
  saveToStorage(prompt, message);
}
