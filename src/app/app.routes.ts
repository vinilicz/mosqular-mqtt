import { Routes } from '@angular/router';
import { LayoutOutlet } from './layout/layout-outlet/layout-outlet';
import { ClientPage } from './pages/client-page/client-page';

export const routes: Routes = [
  {
    path: '',
    component: LayoutOutlet,
    children: [{ path: '', component: ClientPage }],
  },
];
