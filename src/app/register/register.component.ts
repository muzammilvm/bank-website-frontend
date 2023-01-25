import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pass: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
    uname: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]]
  })

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
 
  }

  register() {
    if (this.registerForm.valid) {
      let uname = this.registerForm.value.uname
      let acno = this.registerForm.value.acno
      let pass = this.registerForm.value.pass
      this.api.register(uname, acno, pass).subscribe((result: any) => {
        // console.log(result);
        alert(result.message)
        //navigate to login
       this.router.navigateByUrl('')
      },
        // using another callback for catching error
        (result: any) => {
          alert(result.error.message)
        })

      console.log(acno, pass, uname);

    } else {
      alert('Invalid Form')
    }
  }
}
