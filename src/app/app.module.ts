import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp  } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth'
import { CursosComponent } from './components/cursos/cursos.component';
import { AgregarCursoComponent } from './components/agregar-curso/agregar-curso.component';
import { environment } from 'src/environments/environments';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { FooterComponent } from './components/footer/footer.component';
//import { CursoDetalleComponent } from './components/curso-detalle/curso-detalle.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PaginaErrorComponent } from './components/pagina-error/pagina-error.component';
import { from } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from 'src/pipes/filter.pipe';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { RecaptchaModule } from 'ng-recaptcha';
import { ToastrModule } from 'ngx-toastr';
import { MapaSitioComponent } from './components/mapa-sitio/mapa-sitio.component';
import { AdminGuard } from './admin.guard';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { ContenidoCursoComponent } from './components/contenido-curso/contenido-curso.component';
import { AuthModule } from '@auth0/auth0-angular';

@NgModule({
  declarations: [
    AppComponent,
    CursosComponent,
    AgregarCursoComponent,
    NavegacionComponent,
    FooterComponent,
    LoginComponent,
    RegistroComponent,
    PaginaErrorComponent,
    PreguntasComponent,
    MapaSitioComponent,
    ListaUsuariosComponent,
    ContenidoCursoComponent
      //  CursoDetalleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,  
    RecaptchaModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(()=> getStorage()),
    AuthModule.forRoot(environment.auth),
    //Storage,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule // Importa el módulo de autenticación
    
  ],
  providers: [FilterPipe, AdminGuard],
  bootstrap: [AppComponent],
  
})
export class AppModule { }