import { getSession, onAuthChange, signOut } from './auth.js';

const BASE = '/kinio'; // <- seu repo no GitHub Pages

const content = () => document.getElementById('app-content');
const btnLogout = () => document.getElementById('btn-logout');
const topTitle = () => document.getElementById('top-title');

function currentPage(){
  return location.hash.replace('#/', '') || 'dashboard';
}

async function loadHtml(path){
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao carregar ${path}`);
  return await res.text();
}

async function maybeMountController(page){
  const controllers = {
    login:  () => import(`${BASE}/pages/login.js?v=1`),
    signup: () => import(`${BASE}/pages/signup.js?v=1`),
    tasks:  () => import(`${BASE}/pages/tasks.js?v=1`),
  };

  if (!controllers[page]) return;
  const mod = await controllers[page]();
  if (mod?.mount) mod.mount();
}

export async function render(){
  const session = await getSession();
  const page = currentPage();

  // Gate de auth
  if (!session && !['login','signup'].includes(page)){
    location.replace(`${BASE}/app.html#/login`);
    return;
  }
  if (session && ['login','signup'].includes(page)){
    location.replace(`${BASE}/app.html#/dashboard`);
    return;
  }

  btnLogout().style.display = session ? 'inline-block' : 'none';

  const map = {
    login:     { title: 'Entrar',      file: `${BASE}/pages/login.html` },
    signup:    { title: 'Criar conta', file: `${BASE}/pages/signup.html` },
    dashboard: { title: 'Dashboard',   file: `${BASE}/pages/dashboard.html` },
    tasks:     { title: 'Tarefas',     file: `${BASE}/pages/tasks.html` },
  };

  const route = map[page] || map.dashboard;
  topTitle().textContent = route.title;

  content().innerHTML = await loadHtml(route.file + '?v=1');
  await maybeMountController(page);

  btnLogout().onclick = async () => {
    await signOut();
    location.replace(`${BASE}/app.html#/login`);
  };
}

export function initRouter(){
  window.addEventListener('hashchange', () => render());
  onAuthChange(() => render());
  render();
}
