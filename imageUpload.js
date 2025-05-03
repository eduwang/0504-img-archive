import { storage, db } from './firebaseConfig.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { auth, onAuthStateChanged } from './firebaseConfig.js';

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
  }
});



document.getElementById('image-file').addEventListener('change', (e) => {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  const file = e.target.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);
  }
});

document.getElementById('upload-btn').addEventListener('click', async () => {
  const imageName = document.getElementById('image-name').value.trim();
  const imageFile = document.getElementById('image-file').files[0];

  if (!imageName || !imageFile) {
    alert('이미지 이름과 파일을 모두 입력해주세요.');
    return;
  }

  try {
    const fileRef = storageRef(storage, `images/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(fileRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await addDoc(collection(db, "images"), {
      name: imageName,
      url: downloadURL,
      timestamp: Date.now(),
    });

    const query = `?name=${encodeURIComponent(imageName)}&url=${encodeURIComponent(downloadURL)}`;
    window.location.href = `imageFeedback.html${query}`;
  } catch (error) {
    console.error("업로드 실패:", error);
    alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
  }
});
