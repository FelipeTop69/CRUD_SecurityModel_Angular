import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { IndiceUserComponent } from './indice-user/indice-user.component';

export const routes: Routes = [
    {path: '', component:LandingComponent},
    {path: 'user', component:IndiceUserComponent},
];
