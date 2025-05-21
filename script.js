document.getElementById("send-button").addEventListener("click", async function() {
    const userInput = document.getElementById("user-input").value;

    if (!userInput) return; // Ne rien faire si l'utilisateur n'a pas saisi de message

    // Afficher le message de l'utilisateur dans la zone de chat
    appendMessage("Vous: " + userInput);

    // Envoyer la demande à l'API Groq
    const response = await fetch("https://chatgpt-42.p.rapidapi.com/chatbotapi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
            "x-rapidapi-key": "2413118117msh97c68a8454ed446p157561jsn49d57d5fe542", // Remplacer par ta clé API si nécessaire
        },
        body: JSON.stringify({
            bot_id: "OEXJ8qFp5E5AwRwymfPts90vrHnmr8yZgNE171101852010w2S0bCtN3THp448W7kDSfyTf3OpW5TUVefz", // Remplacer par ton bot_id si nécessaire
            messages: [
                {
                    role: "user",
                    content: userInput
                }
            ],
            temperature: 0.9,
            top_k: 5,
            top_p: 0.9,
            max_tokens: 256,
            model: "gpt 3.5"
        })
    });

    // Traiter la réponse de l'API
    const data = await response.json();
    const botResponse = data?.choices?.[0]?.message?.content || "Désolé, je n'ai pas compris.";

    // Afficher la réponse de MarcGPT
    appendMessage("MarcGPT: " + botResponse);

    // Réinitialiser l'input
    document.getElementById("user-input").value = "";
});

// Fonction pour ajouter un message à la zone de chat
function appendMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;  // Faire défiler jusqu'en bas
}
