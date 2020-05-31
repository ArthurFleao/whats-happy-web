import { HeaderMenuComponent } from './shared/header-menu/header-menu.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, FormGroupDirective } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from './pages/test/test.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { FormLoginComponent } from './shared/form-login/form-login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormCadastroComponent } from './shared/form-cadastro/form-cadastro.component';
import { FormPsicologoComponent } from './shared/form-psicologo/form-psicologo.component';
import { ArtButtonComponent } from './shared/art-button/art-button.component';
import { FocusInvalidDirective } from './directives/focus-invalid.directive';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TestBoxComponent } from './shared/test-box/test-box.component';
import { CadastrarPacienteComponent } from './pages/cadastrar-paciente/cadastrar-paciente.component';
import { EnviarRelatoPageComponent } from './pages/enviar-relato-page/enviar-relato-page.component';
import { FormEnviarRelatoComponent } from './shared/form-enviar-relato/form-enviar-relato.component';
import { MenuLateralComponent } from './shared/menu-lateral/menu-lateral.component';
import { ListarPacientesPageComponent } from './pages/listar-pacientes-page/listar-pacientes-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { AppCardComponent } from './shared/app-card/app-card.component';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';

const material = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatExpansionModule,
  MatBadgeModule
];
@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginPageComponent,
    FormLoginComponent,
    FormCadastroComponent,
    FormPsicologoComponent,
    ArtButtonComponent,
    FocusInvalidDirective,
    HomePageComponent,
    TestBoxComponent,
    CadastrarPacienteComponent,
    EnviarRelatoPageComponent,
    FormEnviarRelatoComponent,
    MenuLateralComponent,
    HeaderMenuComponent,
    ListarPacientesPageComponent,
    PerfilPageComponent,
    AppCardComponent
  ],
  imports: [
    material,
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    AngularFirestoreModule,
  ],
  providers: [
    AngularFireAuthGuard,
    { provide: REGION, useValue: 'us-central1' }
  ],
  bootstrap: [AppComponent],
  exports: [LoginPageComponent, FormLoginComponent, FormCadastroComponent]
})
export class AppModule { }
