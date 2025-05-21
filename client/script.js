async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatLog = document.getElementById("chatLog");
  const userMessage = inputField.value;

  if (!userMessage.trim()) return;

  chatLog.innerHTML += `<p><b>Toi :</b> ${userMessage}</p>`;
  inputField.value = "";

  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await response.json();
  chatLog.innerHTML += `<p><b>MarcGPT :</b> ${data.response}</p>`;
  chatLog.scrollTop = chatLog.scrollHeight;
}
