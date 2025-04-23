import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { IndiceUserComponent } from './user/indice-user/indice-user.component';
import { FormUserComponent } from './user/create-user/create-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { IndicePersonComponent } from './person/indice-person/indice-person.component';
import { CreatePersonComponent } from './person/create-person/create-person.component';
import { UpdatePersonComponent } from './person/update-person/update-person.component';

export const routes: Routes = [
    {path: '', component:LandingComponent},

    // User
    {path: 'user', component:IndiceUserComponent},
    {path: 'user/create', component: FormUserComponent },
    {path: 'user/update/:id', component: UpdateUserComponent },

    // Person
    {path: 'person', component:IndicePersonComponent},
    {path: 'person/create', component:CreatePersonComponent},
    {path: 'person/update/:id', component:UpdatePersonComponent},
];
