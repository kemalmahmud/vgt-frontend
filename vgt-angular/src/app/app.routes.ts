import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BrowseComponent } from './pages/browse/browse.component';

export const routes: Routes = [
    {path:'', redirectTo: '/login', pathMatch: 'full'}, // default route to login
    {path:'home', component: HomeComponent}, 
    {path:'login', component: LoginComponent}, 
    {path:'register', component: RegisterComponent},
    {path:'browse', component: BrowseComponent}, 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
