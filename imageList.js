import { auth, onAuthStateChanged } from './firebaseConfig.js';

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
  }
});


import { db } from './firebaseConfig.js';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const imageList = document.getElementById('image-list');

async function fetchImages() {
  try {
    const imageCollection = collection(db, "images");
    const q = query(imageCollection, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      imageList.innerHTML = '<li>업로드된 이미지가 없습니다.</li>';
      return;
    }

    snapshot.forEach(doc => {
      const { name, url } = doc.data();

      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${url}" alt="${name}" class="image-thumbnail" />
        <div class="image-info">
          <strong>${name}</strong><br/>
          <a href="${url}" target="_blank">원본 보기</a>
        </div>
      `;

      imageList.appendChild(li);
    });
  } catch (error) {
    console.error("이미지 목록을 불러오는 중 오류 발생:", error);
    imageList.innerHTML = '<li>이미지를 불러오지 못했습니다.</li>';
  }
}

fetchImages();
