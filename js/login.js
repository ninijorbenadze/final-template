// უკვე ავტორიზებული მომხმარებელი — მთავარ გვერდზე გადამისამართება
console.log("AUTH JS RUNNING");

if (localStorage.getItem('user')) {
  window.location.href = 'index.html';
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('registration-form');

const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('registration-tab');

loginTab.addEventListener('click', () => {
  loginForm.hidden = false;
  registerForm.hidden = true;
});

registerTab.addEventListener('click', () => {
  loginForm.hidden = true;
  registerForm.hidden = false;
});

document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('login-name').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorEl = document.getElementById('login-error');

  if (!name || !password) {
    errorEl.textContent = 'შეიყვანე ყველა ველი';
    errorEl.hidden = false;
    return;
  }

  const savedUser = JSON.parse(localStorage.getItem(`user-${name}`));

  if (!savedUser) {
    errorEl.textContent = 'მომხმარებელი არ არსებობს';
    errorEl.hidden = false;
    return;
  }

  if (savedUser.password !== password) {
    errorEl.textContent = 'არასწორი პაროლი';
    errorEl.hidden = false;
    return;
  }

  localStorage.setItem('user', name);
  document.cookie = 'authorized=true; path=/';

  window.location.href = 'index.html';
});

document.getElementById('registration-form')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name-reg').value.trim();
  const email = document.getElementById('email-reg').value.trim();
  const phone = document.getElementById('numb-reg').value.trim();
  const password = document.getElementById('pass-reg').value;
  const confirm = document.getElementById('pass-reg-conf').value;

  const regError = document.getElementById('register-error');
  const regSuccess = document.getElementById('register-success');

  if (!name || !password) {
    regError.textContent = 'შეავსე ყველა ველი';
    regError.hidden = false;
    return;
  }

  if (password !== confirm) {
    regError.textContent = 'პაროლები არ ემთხვევა';
    regError.hidden = false;
    return;
  }

  const user = { name, email, phone, password };

  localStorage.setItem(`user-${name}`, JSON.stringify(user));

  regError.hidden = true;
  regSuccess.textContent = 'რეგისტრაცია წარმატებულია!';
  regSuccess.hidden = false;

  e.target.reset();
});