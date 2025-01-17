import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacebookService, InitParams, LoginResponse } from 'ngx-fb';
import { ApiMethod } from 'ngx-fb/dist/esm/providers/facebook';
import { ToastrService } from 'ngx-toastr';
import { PublicacionFacebook } from 'src/app/models/publicacion-facebook/publicacion-facebook';
import { PublicacionFacebookService } from 'src/app/services/publicacion-facebook/publicacion-facebook.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { ConfirmDialogComponent } from 'src/app/utils/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-publicacion-facebook',
  templateUrl: './publicacion-facebook.component.html',
  styleUrls: ['./publicacion-facebook.component.css'],
})
export class PublicacionFacebookComponent implements OnInit {
  publicacionFacebook: PublicacionFacebook = new PublicacionFacebook();
  listaPublicaciones: Array<PublicacionFacebook> =
    new Array<PublicacionFacebook>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FacebookService,
    private publicacionFacebookService: PublicacionFacebookService,
    private dialog: MatDialog,
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

    this.iniciarFb();

    this.getPublicacionesBD();
  }

  postFb(publicacion: PublicacionFacebook) {
    var apiMethod: ApiMethod = 'post';
    this.fb.api('/114025407589430/feed', apiMethod, {
      message:
        publicacion.fecha +
        ' - ' +
        publicacion.titulo +
        ': ' +
        publicacion.noticia,
      access_token:
        'EAAIH4Jj8kKoBAA8IKzijLgMruSzTzHWIBvT8WjHpPZAsoOtwouCH89qFNuvfSwuRenzLPZBVswp4Mh1W65VBLvZBZCEQpg1NbR0R5YMClTETcxZCpEZCqG1Qwvmh3VtrJyA411ZClmfcQMWRpS7UL9l7F8Cex9sKNzAQZCH30X81oIMWjcOPoEqnML8WMAVRSvVVInEhHrIfyUFKwyLVz9qZB',
    });
  }
  iniciarFb() {
    let initParams: InitParams = {
      appId: '571611174178986',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v7.0',
    };
    this.fb.init(initParams);
  }

  agregarNoticia() {
    console.log(this.publicacionFacebook);
    this.publicacionFacebookService
      .guardarPublicacion(this.publicacionFacebook)
      .subscribe(
        (result) => {
          console.log(result);
          if (result.status == '1') {
            this.toastr.success(
              'La Publicacion se cargo exitosamente',
              'Publicacion Exitosa'
            );
            this.postFb(this.publicacionFacebook);
            this.publicacionFacebook = new PublicacionFacebook();
            this.getPublicacionesBD();
          } else {
            this.toastr.error(
              'Todos los campos son requeridos!!!',
              'Error al cargar'
            );
          }
        },
        (error) => {
          console.log(error);
          this.publicacionFacebook = new PublicacionFacebook();
          this.toastr.error('Hubo un error en el proceso', 'Error');
        }
      );
  }

  getPublicacionesBD() {
    this.listaPublicaciones = new Array<PublicacionFacebook>();
    this.publicacionFacebookService.getPublicaciones().subscribe(
      (result) => {
        result.forEach((element) => {
          let vPublicacion = new PublicacionFacebook();
          Object.assign(vPublicacion, element);
          this.listaPublicaciones.push(vPublicacion);
        });
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error en la carga de noticias');
      }
    );
  }

  borrarNoticia(publicacion: PublicacionFacebook) {
    this.publicacionFacebookService
      .borrarPublicacion(publicacion._id)
      .subscribe(
        (result) => {
          this.toastr.info(
            'Publicacion fue Eliminada Correctamente',
            'Operacion Exitosa.'
          );
          console.log(result);
          this.getPublicacionesBD();
        },
        (error) => {
          console.log(error);
          alert('error en la peticion');
        }
      );
  }

  cambiarEstadoNoticia(publicacion: PublicacionFacebook) {
    if (publicacion.vigente == true) {
      publicacion.vigente = false;

      this.publicacionFacebookService.updatePublicacion(publicacion).subscribe(
        (result) => {
          console.log(result);
          this.toastr.success(
            'ESTADO DE LA NOTICIA ACTUALIZADO CORRECTAMENTE!',
            'Operacion Modificacion Exitosa.'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      publicacion.vigente = true;

      this.publicacionFacebookService.updatePublicacion(publicacion).subscribe(
        (result) => {
          console.log(result);
          this.toastr.success(
            'ESTADO DE LA NOTICIA ACTUALIZADO CORRECTAMENTE!',
            'Operacion Modificacion Exitosa.'
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  cancelar() {
    this.publicacionFacebook = new PublicacionFacebook();
    this.toastr.info('Operacion Cancelada');
    this.router.navigate(['home']);
  }

  confirmDelete(publicacion: PublicacionFacebook): void {
    //dialog.open - recibe el componente que va a lanzar la ventana emergente, y un objeto que incluye un mensaje y el objeto a guardar
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Seguro que desea eliminar?",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) 
        this.borrarNoticia(publicacion);
    });
  }

  confirmChangeStatus(publicacion: PublicacionFacebook): void {
    //dialog.open - recibe el componente que va a lanzar la ventana emergente, y un objeto que incluye un mensaje y el objeto a guardar
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Cambiar el estado de la publicación?",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) 
        this.cambiarEstadoNoticia(publicacion);
    });
  }
}
