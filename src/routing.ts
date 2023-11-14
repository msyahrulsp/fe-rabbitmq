import React, { LazyExoticComponent } from 'react';

interface Route {
  path: string;
  component: LazyExoticComponent<React.FC>;
}

export const routing: Route[] = [
  {
    path: '/',
    component: React.lazy(() =>
      import('./pages/Home').then((module) => ({
        default: module.HomePage
      }))
    )
  }
  // {
  //   path: '/customer',
  //   component: React.lazy(() =>
  //     import('./pages/Customer').then((module) => ({
  //       default: module.CustomerPage
  //     }))
  //   )
  // },
  // {
  //   path: '/chef',
  //   component: React.lazy(() =>
  //     import('./pages/Chef').then((module) => ({
  //       default: module.ChefPage
  //     }))
  //   )
  // },
  // {
  //   path: '/receptionist',
  //   component: React.lazy(() =>
  //     import('./pages/Receptionist').then((module) => ({
  //       default: module.ReceptionistPage
  //     }))
  //   )
  // }
];
