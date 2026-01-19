import { signIn, signUp } from '../assets/js/auth.js';

export function mount(){
  const form = document.getElementById('login-form');
  const msg = document.getElementById('login-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value;
    const mode = form.mode.value;

    try{
      if (mode === 'signup'){
        await signUp(email, password);
        msg.textContent = 'Conta criada. Se pedir confirmação por email, confirma e tenta logar.';
      } else {
        await signIn(email, password);
        location.replace('../app.html?page=dashboard');
      }
    } catch (err){
      msg.textContent = err?.message || 'Erro ao autenticar';
    }
  });
}
