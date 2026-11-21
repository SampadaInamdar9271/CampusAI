function enterCampus() {
    window.location.href = "dashboard.html";
}

function getSessionId() {
    let sessionId = localStorage.getItem("campusAI_session");

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("campusAI_session", sessionId);
    }

    return sessionId;
}

function setQuestion(question) {
    const input = document.getElementById("userQuestion");

    if (input) {
        input.value = question;
        input.focus();
    }
}

async function askAI() {

    const input = document.getElementById("userQuestion");

    if (!input) {
        alert("Input box not found");
        return;
    }

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    const chatMessages = document.querySelector(".chat-messages");

    if (!chatMessages) {
        alert("Chat area not found");
        return;
    }

    // Show user's message
    chatMessages.innerHTML += `
        <div class="message user-message">
            <div class="message-content">
                ${escapeHTML(message)}
            </div>
        </div>
    `;

    input.value = "";

    // Show Thinking...
    const thinkingId = "thinking-" + Date.now();

    chatMessages.innerHTML += `
        <div class="message ai-message" id="${thinkingId}">
            <div class="message-avatar">AI</div>
            <div class="message-content">
                Thinking...
            </div>
        </div>
    `;

    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {

        const response = await fetch(
            "http://127.0.0.1:5001/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message,
                    sessionId: getSessionId()
                })
            }
        );

        const data = await response.json();

        const thinkingMessage =
            document.getElementById(thinkingId);

        if (!thinkingMessage) {
            return;
        }

        const content =
            thinkingMessage.querySelector(".message-content");

        if (data.reply) {

            content.textContent = data.reply;

        } else {

            content.textContent =
                "Backend error: " +
                (data.error || "Unknown error");

        }

    } catch (error) {

        console.error("CampusAI Error:", error);

        const thinkingMessage =
            document.getElementById(thinkingId);

        if (thinkingMessage) {

            thinkingMessage.querySelector(
                ".message-content"
            ).textContent =
                "Could not connect to the CampusAI server.";

        }
    }

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            document.getElementById("userQuestion");

        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        askAI();
                    }
                }
            );
        }
    }
);