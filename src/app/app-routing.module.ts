import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarCursoComponent } from './components/agregar-curso/agregar-curso.component';
import { HomeComponent } from './components/home/home.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { LoginComponent } from './components/login/login.component';
import { PaginaErrorComponent } from './components/pagina-error/pagina-error.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { MapaSitioComponent } from './components/mapa-sitio/mapa-sitio.component';
import { AdminGuard } from './admin.guard';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { ContenidoCursoComponent } from './components/contenido-curso/contenido-curso.component';
import { ExamenComponent } from './components/examen/examen.component';
import { RealizaCursoComponent } from './components/realiza-curso/realiza-curso.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';

const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'agregar-curso',component:AgregarCursoComponent, canActivate: [AdminGuard]},
  {path:'cursos',component:CursosComponent},
  {path:'registro',component:RegistroComponent},
  {path: 'login', component: LoginComponent, pathMatch: "full" },
  {path: 'preguntas', component: PreguntasComponent},
  {path: 'mapa', component: MapaSitioComponent},
  {path: 'usuarios', component: ListaUsuariosComponent,  canActivate: [AdminGuard]},
  {path: 'contenido-curso/:cursoUid', component: ContenidoCursoComponent },
  {path: 'examen/:cursoUid', component: ExamenComponent},
  {path: 'realiza-curso/:cursoUid', component: RealizaCursoComponent},
  {path: 'verificacion', component: VerificacionComponent},
  {path: '**', component:PaginaErrorComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
