const container = document.querySelector('.container');
const chatsContainer = document.querySelector('.chat-container');

const promptForm = document.querySelector('.prompt-form');

const promptInput = promptForm.querySelector('.prompt-input');
const themeToggle = document.querySelector('#theme-toggle-btn');



// API URL

const API_KEY ="AIzaSyCQYD_dGBhSOZIAGrKEjVCs3ko1S86Ndns";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;


// handel the form submission 

let userMessage ="";
const chatHistory = [];

const createMsgElement = (html, ...classes) => {
    const div = document.createElement('div');
    div.classList.add("message", ...classes);
    div.innerHTML = html;
    return div;
}


// scroll to bottom 
const scrollToBottom = ( ) => container.scrollTo({top: container.scrollHeight, behavior: "smooth"})




// interval to type each words 

const typingEffect = (text, textElement, botMsgDiv) => {
    textElement.textContent = "";
    const words = text.split(" ");
    let wordIndex = 0;

    const typingInterval = setInterval(() => {
        if(wordIndex < words.length){
            textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex];
            wordIndex++;
            botMsgDiv.classList.remove("loading");
            scrollToBottom();
        }else{
            clearInterval(typingInterval);
        }
    }, 40);

}


const generateBotResponse = async (botMsgDiv) => {

    const textElement = botMsgDiv.querySelector(".message-text");

    // to store history of chat 
    chatHistory.push({role: "user",
        parts:[{text: userMessage}]
    })
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({contents: chatHistory})
        });
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        // process of displaying response text with typing effect

        const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
        typingEffect(responseText, textElement, botMsgDiv);
    }catch(error){
            console.log(error);
    }
}


const handelFormSubmit = (e) => {    
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if(!userMessage)  return ;


    promptInput.value ="";

    // generate user message html and add in the chats container 

    const  userMsgHTML = ` <p class="message-text"></p>`;
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);
    scrollToBottom();


    setTimeout(() => {
        const  botMsgHTML = ` <img src="./gemini-chatbot-logo.svg" alt="" class="avatar"> <p class="message-text">Just a sec ...</p>`;
        const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
    
        chatsContainer.appendChild(botMsgDiv);
        scrollToBottom();
        generateBotResponse(botMsgDiv);
    
        },600);
    }

    themeToggle.addEventListener("click", () => {
          document.body.classList.toggle("light-theme");
      
    });


    


   

promptForm.addEventListener('submit', handelFormSubmit);