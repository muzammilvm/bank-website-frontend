import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMsg: string = ''
  successMsg: boolean = false
 

  loginForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pass: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]]
  })

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {

  }

  login() {
    if (this.loginForm.valid) {
      let acno = this.loginForm.value.acno
      let pass = this.loginForm.value.pass
      console.log(acno, pass);

      this.api.login(acno, pass).subscribe((result: any) => {
        // console.log(result);
        // alert(result.message)

        this.successMsg = true

        // setting username into local storage
        localStorage.setItem('username', result.username)

        // current Account number
        localStorage.setItem('currentAcno',JSON.stringify(result.currentAcno))

        // store token
        localStorage.setItem('token',result.token)
        
        //navigate to dashboard by setting 2 seconds delay
        setTimeout(() => {
          this.router.navigateByUrl('dashboard')
        }, 2000)

      },
        // using another callback for catching error
        (result: any) => {
          this.errorMsg = result.error.message
          setTimeout(() => {
            this.errorMsg=''
            this.loginForm.reset()
          }, 1500);
        })

    } else {
      alert('Invalid Form')
    }


  }

}
