import { signUp } from '../assets/js/auth.js';

export function mount(){
  const form = document.getElementById('signup-form');
  const msg = document.getElementById('signup-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value;

    try{
      await signUp(email, password);
      msg.textContent = 'Conta criada! Se pedir confirmação por email, confirma e depois faz login.';
      // opcional: redirecionar pro login depois de 1.2s
      setTimeout(() => location.replace('../app.html#/login'), 1200);
    }catch(err){
      msg.textContent = err?.message || 'Erro ao criar conta';
    }
  });
}
