import { getSession, onAuthChange, signOut } from './auth.js';

const content = () => document.getElementById('app-content');
const btnLogout = () => document.getElementById('btn-logout');
const topTitle = () => document.getElementById('top-title');

function currentPage(){
  return new URLSearchParams(location.search).get('page') || 'dashboard';
}

async function loadHtml(path){
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao carregar ${path}`);
  return await res.text();
}

async function maybeMountController(page){
  const controllers = {
    login: () => import('../pages/login.js'),
    signup: () => import('../pages/signup.js'),
    tasks: () => import('../pages/tasks.js'),
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
    location.replace('app.html#/login');
    return;
  }
  if (session && ['login','signup'].includes(page)){
    location.replace('app.html#/dashboard');
    return;
  }

  btnLogout().style.display = session ? 'inline-block' : 'none';

  const map = {
    login: { title: 'Entrar', file: 'pages/login.html' },
    signup: { title: 'Criar conta', file: 'pages/signup.html' },
    dashboard: { title: 'Dashboard', file: 'pages/dashboard.html' },
    tasks: { title: 'Tarefas', file: 'pages/tasks.html' },
  };

  const route = map[page] || map.dashboard;
  topTitle().textContent = route.title;

  content().innerHTML = await loadHtml(route.file);
  await maybeMountController(page);

  // logout
  btnLogout().onclick = async () => {
    await signOut();
    location.replace('app.html?page=login');
  };
}

export function initRouter(){
  onAuthChange(() => render());
  render();
}
