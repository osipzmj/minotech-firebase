import { Component, OnInit } from '@angular/core';
import { Auth, PhoneAuthProvider, signInWithCredential } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {
  otp!: string
  verify: any;

  constructor( private cursoService: CursosService, private authService: UsuariosService, private toastr: ToastrService, private auth: Auth, private router: Router ){
    }
  
  ngOnInit() {
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}')
    console.log(this.verify);
  }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  onOtpChange(otpCode: any){
    this.otp = otpCode;
    console.log(this.otp);
  }

  handleClick(){
    var credentials = PhoneAuthProvider.credential(this.verify, this.otp)

    signInWithCredential(this.auth, credentials).then((response) => {
      console.log(response);
      localStorage.setItem('user-data', JSON.stringify(response));
      this.router.navigate(['/home'])
      this.toastr.success('Bienvenido')
    }).catch((error) => {
      alert(error.message);
    })
  }
  
}
