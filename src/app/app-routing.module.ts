import { CadastrarPacienteComponent } from './pages/cadastrar-paciente/cadastrar-paciente.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TestComponent } from './pages/test/test.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';


const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path: '',  redirectTo: 'login', pathMatch: 'full'},
  {path: 'teste', component: TestComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'login', component: LoginPageComponent},
  {path: 'cadastro', component: CadastrarPacienteComponent},
  {path: 'home', component: HomePageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
