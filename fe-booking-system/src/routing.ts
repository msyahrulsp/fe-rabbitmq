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
  },
  {
    path: '/customer',
    component: React.lazy(() =>
      import('./pages/Pasient').then((module) => ({
        default: module.PasientPage
      }))
    )
  },
  {
    path: '/general',
    component: React.lazy(() =>
      import('./pages/General').then((module) => ({
        default: module.GeneralPage
      }))
    )
  },
  {
    path: '/vaccination',
    component: React.lazy(() =>
      import('./pages/Vaccination').then((module) => ({
        default: module.VaccinationPage
      }))
    )
  }
];
