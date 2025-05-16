import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'timeline',
    loadChildren: () => import('./timeline/timeline.module').then(m => m.TimelineModule),
    canActivate: [authGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [authGuard]
  },
  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then(m => m.EventModule),
    canActivate: [authGuard]
  },
  {
    path: 'favorite',
    loadChildren: () => import('./favorite/favorite.module').then(m => m.FavoriteModule),
    canActivate: [authGuard]
  },
  {
    path: 'media',
    loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    canActivate: [authGuard]
  },
  {
    path: 'role',
    loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'timeline',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'timeline'
  }
];
