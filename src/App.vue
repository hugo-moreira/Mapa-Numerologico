<template>
  <div class="app-shell">
    <header class="global-header">
      <div class="header-logo">
        <div class="logo-glyph">✦</div>
        <span class="logo-text">Numerologia <strong>Pitagórica</strong></span>
      </div>

      <nav class="header-nav">
        <router-link to="/" class="nav-link" :class="{ active: $route.name === 'Entrada' }">Mapa</router-link>
        <span class="nav-dot">·</span>
        <router-link to="/jornada" class="nav-link" :class="{ active: $route.name === 'JornadaVida' }">Jornada</router-link>
        <span class="nav-dot">·</span>
        <router-link to="/sinastria" class="nav-link" :class="{ active: $route.name === 'Sinastria' }">Sinastria</router-link>
        <span class="nav-dot">·</span>
        <router-link to="/historico" class="nav-link" :class="{ active: $route.name === 'Historico' }">Histórico</router-link>
        <span class="nav-dot">·</span>
        <router-link to="/previsao" class="nav-link" :class="{ active: $route.name === 'PrevisaoAnual' }">Previsão</router-link>
      </nav>

      <div class="header-cta">
        <router-link to="/" class="btn-header">Nova Consulta</router-link>
      </div>
    </header>

    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.global-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 56px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-blue2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 100;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-glyph {
  width: 30px;
  height: 30px;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--gold);
}

.logo-text {
  font-size: 13px;
  font-weight: 300;
  color: var(--text);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.logo-text strong {
  font-weight: 600;
  color: var(--gold);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  padding: 6px 14px;
  font-size: 13px;
  color: var(--text-dim);
  border-radius: 6px;
  text-decoration: none;
  letter-spacing: 0.2px;
  transition: color 0.15s, background 0.15s;
}

.nav-link:hover {
  color: var(--text);
  background: rgba(30, 58, 95, 0.3);
}

.nav-link.active {
  color: var(--gold);
  background: var(--gold-dim);
}

.nav-dot {
  color: var(--border-blue2);
  padding: 0 2px;
  font-size: 12px;
}

.header-cta {
  flex-shrink: 0;
}

.btn-header {
  padding: 7px 16px;
  background: linear-gradient(135deg, var(--gold), #a8841d);
  color: var(--text-dark);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
  transition: opacity 0.15s;
}

.btn-header:hover {
  opacity: 0.9;
}

.page-content {
  flex: 1;
  padding-top: 56px;
}
</style>
