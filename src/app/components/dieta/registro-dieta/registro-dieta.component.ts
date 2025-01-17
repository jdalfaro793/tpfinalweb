import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from 'src/app/models/alumno/alumno';
import { MesDieta } from 'src/app/models/mesDieta/mes-dieta';
import { RegistroDieta } from 'src/app/models/registroDieta/registro-dieta';
import { AlumnoService } from 'src/app/services/alumno/alumno.service';
import { MesDietaService } from 'src/app/services/dieta/mes-dieta.service';
import { RegistroDietaService } from 'src/app/services/dieta/registro-dieta.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-registro-dieta',
  templateUrl: './registro-dieta.component.html',
  styleUrls: ['./registro-dieta.component.css'],
})
export class RegistroDietaComponent implements OnInit {
  alumno: Alumno;

  foto: string;

  registroDieta: RegistroDieta;

  planesAlimenticios: Array<MesDieta>;

  filtersObjetivo: string;
  filtersMes: any;

  planSelect: MesDieta;

  planSemanalView: MesDieta;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mesDietaService: MesDietaService,
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private registroDietaService: RegistroDietaService,
    private router: Router,
    private usuarioService: UsuarioService
    ) { 
      if(this.usuarioService.userLoggedIn() == false){
        alert("Debe validarse e ingresar su usuario y clave");
        this.router.navigate(['login']);
    }else if(this.usuarioService.isLoggedAlumno() == true){
      alert("No tiene permisos para esta seccion");
        this.router.navigate(['home']);
    }
    }

  ngOnInit(): void {
    this.init();
    this.activatedRoute.params.subscribe((params) => {
      this.cargarAlumno(params.id);
      this.cargarPlanesAlimenticios();
    });
  }

  init(): void {
    this.alumno = new Alumno();
    this.registroDieta = new RegistroDieta();
    this.planesAlimenticios = new Array<MesDieta>();
    this.planSemanalView = new MesDieta;
    this.initFiltersPlanAlimenticio();
  }

  initFiltersPlanAlimenticio(): void {
    this.filtersObjetivo = '';
    this.filtersMes = '';
  }

  cargarAlumno(id: string): void {
    this.alumnoService.getAlumno(id).subscribe((result) => {
      this.alumno = result;
      this.registroDieta.alumno = this.alumno;
    });
  }

  onFileChanges(files) {
    this.registroDieta.foto = files[0].base64;
    this.foto = files[0].base64;
  }

  verFoto() {
    this.foto = this.registroDieta.foto;
  }

  saveRegistroDieta(): void {
    if (this.validar()) {
      this.registroDieta.fecha = new Date();
      this.registroDietaService.addRegistro(this.registroDieta).subscribe((result) => {
          console.log(result);
          if (result.status == 1) {
            this.actualizarMesUltimaPlan();
            this.toastr.success(
              'Se ha guardado el registro',
              'OPERACIÓN EXITOSA'
            );
            this.router.navigate(['gestionAlumno']);
          } else {
            this.toastr.success('Ha ocurrido un error', 'ERROR');
          }
        });
    }
  }

  actualizarMesUltimaPlan(){
    this.alumnoService.getAlumno(this.registroDieta.alumno._id).subscribe(
      (result) => {
        let vAlumno = new Alumno;
        Object.assign(vAlumno, result);
        vAlumno.ultimoPlanMes=vAlumno.ultimoPlanMes + 1;
        this.alumnoService.updateAlumno(vAlumno).subscribe(
          (result)=>{
            console.log(result)
          },
          (error)=>{console.log(error);
          }
        )
      },
      (error) => {
        console.log(error);
        alert('error en la peticion');
      });
    }

  validar(): boolean {
    if (this.registroDieta.plan_dieta != undefined) {
      if (this.registroDieta.foto != undefined) {
        return true;
      } else {
        this.toastr.warning('Debe ingresar una imagen', 'ATENCIÓN');
      }
    } else {
      this.toastr.warning(
        'Debe seleccionar un plan de alimentación',
        'ATENCIÓN'
      );
      return false;
    }
  }

  cancelar(): void {
    this.router.navigate(['gestionAlumno'])
  }

  /*
        PLANES ALIMENTICIOS
  */
  cargarPlanesAlimenticios(): void {
    this.mesDietaService
      .get(this.filtersObjetivo, this.filtersMes)
      .subscribe((result) => {
        this.planesAlimenticios = new Array<MesDieta>();
        result.forEach((element) => {
          let p = new MesDieta();
          Object.assign(p, element);
          this.planesAlimenticios.push(p);
        });
      });
  }

  searchPlanAlimentacion(): void {
    this.cargarPlanesAlimenticios();
  }

  cleanFiltersPlanALimenticio(): void {
    this.initFiltersPlanAlimenticio();
    this.cargarPlanesAlimenticios();
  }

  onMesChange(event): void {
    this.filtersMes = event;
    this.cargarPlanesAlimenticios();
  }

  selectPlanAlimenticio(plan: MesDieta): void {
    this.registroDieta.plan_dieta = plan;
    this.registroDieta.objetivo = plan.objetivo;
    this.planSelect = plan;
    this.toastr.info('', 'Plan Seleccionado');
  }

  select(plan: MesDieta): void {
    console.log(plan);
    this.planSemanalView = plan;
  }


}
