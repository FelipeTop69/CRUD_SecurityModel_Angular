import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

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
import { RegisterComponent } from './auth/register/register.component';


export const routes: Routes = [
    {path: '', component:LandingComponent},
    {path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},

    // Form
    {path: 'form', component:IndiceFormComponent, canActivate: [AuthGuard]},
    {path: 'form/create', component:CreateFormComponent, canActivate: [AuthGuard]},
    {path: 'form/update/:id', component:UpdateFormComponent, canActivate: [AuthGuard]},

    // Module
    {path: 'module', component:IndiceModuleComponent, canActivate: [AuthGuard]},
    {path: 'module/create', component:CreateModuleComponent, canActivate: [AuthGuard]},
    {path: 'module/update/:id', component:UpdateModuleComponent, canActivate: [AuthGuard]},

    // Permission
    {path: 'permission', component:IndicePermissionComponent, canActivate: [AuthGuard]},
    {path: 'permission/create', component:CreatePermissionComponent, canActivate: [AuthGuard]},
    {path: 'permission/update/:id', component:UpdatePermissionComponent, canActivate: [AuthGuard]},

    // Person
    {path: 'person', component:IndicePersonComponent, canActivate: [AuthGuard]},
    {path: 'person/create', component:CreatePersonComponent, canActivate: [AuthGuard]},
    {path: 'person/update/:id', component:UpdatePersonComponent, canActivate: [AuthGuard]},

    // Rol
    {path: 'rol', component:IndiceRolComponent, canActivate: [AuthGuard]},
    {path: 'rol/create', component:CreateRolComponent, canActivate: [AuthGuard]},
    {path: 'rol/update/:id', component:UpdateRolComponent, canActivate: [AuthGuard]},

    // User
    { path: 'user', component: IndiceUserComponent, canActivate: [AuthGuard] },
    { path: 'user/create', component: FormUserComponent,canActivate: [AuthGuard] },
    { path: 'user/update/:id', component: UpdateUserComponent,canActivate: [AuthGuard] },

    // RolFormPermission
    {path: 'rolFormPermission', component:IndiceRolFormPermissionComponent, canActivate: [AuthGuard]},
    {path: 'rolFormPermission/create', component:CreateRolFormPermissionComponent, canActivate: [AuthGuard]},
    {path: 'rolFormPermission/update/:id', component:UpdateRolFormPermissionComponent, canActivate: [AuthGuard]},

    // FormModule
    {path: 'formModule', component:IndiceFormModuleComponent, canActivate: [AuthGuard]},
    {path: 'formModule/create', component:CreateFormModuleComponent, canActivate: [AuthGuard]},
    {path: 'formModule/update/:id', component:UpdateFormModuleComponent, canActivate: [AuthGuard]},

    // RolUser
    {path: 'rolUser', component:IndiceRolUserComponent, canActivate: [AuthGuard]},
    {path: 'rolUser/create', component:CreateRolUserComponent, canActivate: [AuthGuard]},
    {path: 'rolUser/update/:id', component:UpdateRolUserComponent, canActivate: [AuthGuard]},
];