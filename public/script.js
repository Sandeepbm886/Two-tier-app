const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");

async function loadMessages() {
  try {
    const response = await fetch("/api/messages");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch messages");
    }

    const messages = Array.isArray(data) ? data : [];

    messagesContainer.innerHTML = "";

    messages.forEach((item) => {
      const div = document.createElement("div");

      div.className = "message";
      div.textContent = item.message;

      messagesContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Failed to load messages:", error);
    messagesContainer.innerHTML = "";

    const div = document.createElement("div");

    div.className = "message error";
    div.textContent = error.message;

    messagesContainer.appendChild(div);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) {
    return;
  }

  try {
    const response = await fetch("/api/messages", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send message");
    }

    input.value = "";

    await loadMessages();
  } catch (error) {
    console.error("Failed to send message:", error);
  }
});

loadMessages();
