import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TestComponent } from './pages/test/test.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '',  redirectTo: 'login', pathMatch: 'full'},
  {path: 'teste', component: TestComponent},
  {path: 'login', component: LoginPageComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
