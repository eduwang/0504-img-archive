import { auth, provider, signInWithPopup, onAuthStateChanged, signOut } from './firebaseConfig.js';

const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const navMenu = document.getElementById('nav-menu');

loginBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    displayUser(user);
  } catch (error) {
    console.error("로그인 실패:", error);
    alert("로그인에 실패했습니다.");
  }
});

function displayUser(user) {
  userInfo.innerHTML = `
    <p>환영합니다, ${user.displayName}님!</p>
    <button id="logout-btn">로그아웃</button>
  `;
  navMenu.style.display = 'block';
  loginBtn.style.display = 'none';

  document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
      location.reload();
    });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    displayUser(user);
  } else {
    userInfo.innerHTML = "<p>로그인 후 사용 가능합니다.</p>";
    navMenu.style.display = 'none';
  }
});
