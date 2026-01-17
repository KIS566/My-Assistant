const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typing = document.getElementById("typing");

let RESPONSES = {};

fetch("responses.json")
  .then(res => res.json())
  .then(data => RESPONSES = data);

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/gi, "").trim();
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerHTML = `<p>${text}</p>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getReply(msg) {
  const text = normalize(msg);
  
  for (let cat in RESPONSES) {
    const { keywords, replies } = RESPONSES[cat];
    for (let key of keywords) {
      if (text.includes(key)) {
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }
  }
  const fb = RESPONSES.fallback.replies;
  return fb[Math.floor(Math.random() * fb.length)];
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  
  addMessage("user", text);
  input.value = "";
  typing.style.display = "block";
  
  setTimeout(() => {
    typing.style.display = "none";
    addMessage("bot", getReply(text));
  }, 900);
}

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

setTimeout(() => {
  addMessage("bot",
    "Hello 👋😊<br>Main ek friendly AI dost hoon 🤖<br>Bas likho — <b>Hi</b> se bhi 😄"
  );
}, 800);




const micBtn = document.getElementById("mic-btn");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  
  micBtn.addEventListener("click", () => {
    recognition.start();
    micBtn.classList.add("listening");
  });
  
  recognition.onresult = (event) => {
    const voiceText = event.results[0][0].transcript;
    micBtn.classList.remove("listening");
    input.value = voiceText;
    sendMessage();
  };
  
  recognition.onend = () => {
    micBtn.classList.remove("listening");
  };
} else {
  micBtn.style.display = "none";
}



if (sender === "bot") {
  const speech = new SpeechSynthesisUtterance(
    text.replace(/<[^>]*>/g, "")
  );
  speech.lang = "en-IN";
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
}
