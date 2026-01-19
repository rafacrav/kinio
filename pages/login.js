import { signIn } from '../assets/js/auth.js';

export function mount(){
  const form = document.getElementById('login-form');
  const msg = document.getElementById('login-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value;

    try{
      await signIn(email, password);
      location.replace('../app.html#/dashboard');
    }catch(err){
      msg.textContent = err?.message || 'Erro ao entrar';
    }
  });
}
