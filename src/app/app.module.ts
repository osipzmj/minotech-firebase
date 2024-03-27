import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp  } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth'
import { HomeComponent } from './components/home/home.component';
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
//import { BotonesComponent } from './components/botones/botones.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CursosComponent,
    AgregarCursoComponent,
    NavegacionComponent,
    FooterComponent,
  //  CursoDetalleComponent,
    LoginComponent,
    RegistroComponent,
    PaginaErrorComponent,
    //BotonesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
