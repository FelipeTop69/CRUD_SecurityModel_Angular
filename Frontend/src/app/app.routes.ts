import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

import { IndicePersonComponent } from './person/indice-person/indice-person.component';
import { CreatePersonComponent } from './person/create-person/create-person.component';
import { UpdatePersonComponent } from './person/update-person/update-person.component';

import { IndiceRolComponent } from './rol/indice-rol/indice-rol.component';
import { CreateRolComponent } from './rol/create-rol/create-rol.component';
import { UpdateRolComponent } from './rol/update-rol/update-rol.component';

import { IndiceUserComponent } from './user/indice-user/indice-user.component';
import { FormUserComponent } from './user/create-user/create-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { CreateFormComponent } from './form/create-form/create-form.component';
import { IndiceFormComponent } from './form/indice-form/indice-form.component';
import { UpdateFormComponent } from './form/update-form/update-form.component';
import { CreatePermissionComponent } from './permission/create-permission/create-permission.component';
import { IndicePermissionComponent } from './permission/indice-permission/indice-permission.component';
import { UpdatePermissionComponent } from './permission/update-permission/update-permission.component';
import { CreateModuleComponent } from './module/create-module/create-module.component';
import { IndiceModuleComponent } from './module/indice-module/indice-module.component';
import { UpdateModuleComponent } from './module/update-module/update-module.component';
import { IndiceRolFormPermissionComponent } from './rolFormPermission/indice-rol-form-permission/indice-rol-form-permission.component';
import { UpdateRolFormPermissionComponent } from './rolFormPermission/update-rol-form-permission/update-rol-form-permission.component';
import { CreateRolFormPermissionComponent } from './rolFormPermission/create-rol-form-permission/create-rol-form-permission.component';
import { IndiceFormModuleComponent } from './formModule/indice-form-module/indice-form-module.component';
import { CreateFormModuleComponent } from './formModule/create-form-module/create-form-module.component';
import { UpdateFormModuleComponent } from './formModule/update-form-module/update-form-module.component';
import { CreateRolUserComponent } from './rolUser/create-rol-user/create-rol-user.component';
import { IndiceRolUserComponent } from './rolUser/indice-rol-user/indice-rol-user.component';
import { UpdateRolUserComponent } from './rolUser/update-rol-user/update-rol-user.component';


export const routes: Routes = [
    {path: '', component:LandingComponent},

    // Form
    {path: 'form', component:IndiceFormComponent},
    {path: 'form/create', component:CreateFormComponent},
    {path: 'form/update/:id', component:UpdateFormComponent},

    // Module
    {path: 'module', component:IndiceModuleComponent},
    {path: 'module/create', component:CreateModuleComponent},
    {path: 'module/update/:id', component:UpdateModuleComponent},

    // Permission
    {path: 'permission', component:IndicePermissionComponent},
    {path: 'permission/create', component:CreatePermissionComponent},
    {path: 'permission/update/:id', component:UpdatePermissionComponent},

    // Person
    {path: 'person', component:IndicePersonComponent},
    {path: 'person/create', component:CreatePersonComponent},
    {path: 'person/update/:id', component:UpdatePersonComponent},

    // Rol
    {path: 'rol', component:IndiceRolComponent},
    {path: 'rol/create', component:CreateRolComponent},
    {path: 'rol/update/:id', component:UpdateRolComponent},

    // User
    {path: 'user', component:IndiceUserComponent},
    {path: 'user/create', component: FormUserComponent },
    {path: 'user/update/:id', component: UpdateUserComponent },

    // RolFormPermission
    {path: 'rolFormPermission', component:IndiceRolFormPermissionComponent},
    {path: 'rolFormPermission/create', component:CreateRolFormPermissionComponent},
    {path: 'rolFormPermission/update/:id', component:UpdateRolFormPermissionComponent},

    // FormModule
    {path: 'formModule', component:IndiceFormModuleComponent},
    {path: 'formModule/create', component:CreateFormModuleComponent},
    {path: 'formModule/update/:id', component:UpdateFormModuleComponent},

    // RolUser
    {path: 'rolUser', component:IndiceRolUserComponent},
    {path: 'rolUser/create', component:CreateRolUserComponent},
    {path: 'rolUser/update/:id', component:UpdateRolUserComponent},
];