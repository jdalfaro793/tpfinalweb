import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { RutinaComponent } from './components/rutina/rutina.component';
import { LoginComponent } from './components/login/login.component';
import { GestionCuotaComponent } from './components/cuota/gestion-cuota/gestion-cuota.component';
import { FormAlumnoComponent } from './components/form-alumno/form-alumno/form-alumno.component';

const routes: Routes = [
  { path: 'asistencia/:id',component: AsistenciaComponent },
  { path: 'rutinapersonal/:id',component: RutinaComponent },
  { path: 'login',component: LoginComponent },
  { path: 'gestion-cuota', component: GestionCuotaComponent},
  { path: 'alumno/form-alumno', component: FormAlumnoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
