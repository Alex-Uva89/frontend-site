// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      // pagina lista locali su mappa
      { path: 'venues', name: 'venues', component: () => import('pages/ListVenuePage.vue') },

      // pagina singolo locale
      { path: 'locale/:id', name: 'locale', component: () => import('pages/VenuePage.vue') }
    ],
  },

  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]
export default routes
