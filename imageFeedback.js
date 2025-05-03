import { auth, onAuthStateChanged } from './firebaseConfig.js';

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
  }
});


const params = new URLSearchParams(window.location.search);
const imageName = params.get('name');
const imageURL = params.get('url');

const imageInfo = document.getElementById('image-info');
const imageElement = document.getElementById('uploaded-image');
const feedbackDisplay = document.getElementById('feedback');
const feedbackButton = document.getElementById('feedback-btn');

imageInfo.innerText = `이미지 이름: ${imageName}`;
imageElement.src = imageURL;

feedbackButton.addEventListener('click', async () => {
  feedbackDisplay.innerText = 'GPT 피드백 생성 중...';

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // or gpt-4.0 depending on access
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides feedback on images. Based on the URL provided, generate feedback about the image’s educational or visual content."
          },
          {
            role: "user",
            content: `Please give feedback on the following image: ${imageURL}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;
    feedbackDisplay.innerText = message || "피드백을 가져오지 못했습니다.";
  } catch (error) {
    console.error("GPT 호출 에러:", error);
    feedbackDisplay.innerText = "GPT 피드백 생성에 실패했습니다.";
  }
});
