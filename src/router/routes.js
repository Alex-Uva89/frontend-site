// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },

      // lista locali su mappa
      { path: 'venues', name: 'venues', component: () => import('pages/ListVenuePage.vue') },

      // singolo locale
      { path: 'locale/:id', name: 'locale', component: () => import('pages/VenuePage.vue') },

      // la nostra storia (fix: child path senza slash)
      { path: 'story', name: 'story', component: () => import('pages/OurStory.vue') },

      { path: 'producers', name: 'producers', component: () => import('pages/ProducersPage.vue') },
      { path: 'jobs',      name: 'jobs',      component: () => import('pages/JobsPage.vue') },
      { path: 'contact',   name: 'contact',   component: () => import('pages/ContactPage.vue') },
      { path: 'events',    name: 'events',    component: () => import('pages/EventsPage.vue') }, // per CTA "Eventi privati"
    ],
  },

  // 404
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
]

export default routes
