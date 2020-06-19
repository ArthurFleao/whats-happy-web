import { RelatorioPageComponent } from './pages/relatorio-page/relatorio-page.component';
import { ListarRelatosPageComponent } from './pages/listar-relatos-page/listar-relatos-page.component';
import { ConvidarPacientePageComponent } from './pages/convidar-paciente-page/convidar-paciente-page.component';
import { CadastroPacienteComponent } from './pages/cadastrar-paciente/cadastrar-paciente.component';
import { TestComponent } from './pages/test/test.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
// import para as paginas:
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { EnviarRelatoPageComponent } from './pages/enviar-relato-page/enviar-relato-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { ProntuarioPageComponent } from './pages/prontuario-page/prontuario-page.component';
import { ListarPacientesPageComponent } from './pages/listar-pacientes-page/listar-pacientes-page.component';
import { RegistrarConsultaPageComponent } from './pages/registrar-consulta-page/registrar-consulta-page.component';
import { ListarConvitesComponent } from './pages/listar-convites/listar-convites.component';


const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'teste', component: TestComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'convite/:id', component: CadastroPacienteComponent },
  { path: 'relatorios', component: RelatorioPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'convidar', component: ConvidarPacientePageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'home', component: HomePageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'enviarRelato', component: EnviarRelatoPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'perfil', component: PerfilPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'prontuario', component: ProntuarioPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'registrarConsulta', component: RegistrarConsultaPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  { path: 'listarPacientes', component: ListarPacientesPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome } },
  {
    path: 'paciente/:id', canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToHome },
    children: [
      { path: 'relatos', component: ListarRelatosPageComponent }
    ]
  },

  { path: 'listarConvites', component: ListarConvitesComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
