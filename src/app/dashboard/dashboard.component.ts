import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import party from "party-js";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  depositForm = this.fb.group({
    depositAmt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  })

  logoutDiv: boolean = false
  user: string = ''
  currentAcno: number = 0
  balance: number = 0
  depositMsg: string = ''
  fundTransferSuccessMsg: string = ''
  fundTransferErrorMsg: string = ''
  acno: any = ''
  deleteConfirm: boolean = false
  deleteSpinnerDiv:boolean=false

  transferForm = this.fb.group({
    toAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pass: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]
  })

  constructor(private api: ApiService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      alert('Please Login')
      this.router.navigateByUrl('')
    }

    if (localStorage.getItem('username')) {
      this.user = localStorage.getItem('username') || ''
    }

    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || '')
    }
  }

  getBalance() {
    if (localStorage.getItem("currentAcno")) {
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || '')
      console.log(this.currentAcno);
      this.api.getBalance(this.currentAcno).subscribe((result: any) => {
        console.log(result);
        this.balance = result.balance
      })

    }
  }

  deposit() {
    if (this.depositForm.valid) {
      let amount = this.depositForm.value.depositAmt
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno") || '')
      this.api.deposit(this.currentAcno, amount).subscribe((result: any) => {

        console.log(result);
        this.depositMsg = result.message

        setTimeout(() => {
          this.depositForm.reset()
          this.depositMsg = ''
        }, 3000);
      },
        // error
        (result: any) => {
          this.depositMsg = result.error.message
        })
    } else {
      alert('Invalid Form')
    }
  }

  // showconfetti
  showconfetti(source: any) {
    party.confetti(source)
  }

  //Fund Transfer
  transfer() {
    if (this.transferForm.valid) {
      let toAcno = this.transferForm.value.toAcno
      let pass = this.transferForm.value.pass
      let amount = this.transferForm.value.amount

      this.api.transfer(toAcno, pass, amount).subscribe(
        // success
        (result: any) => {
          console.log(result);

          this.fundTransferSuccessMsg = result.message
          setTimeout(() => {
            this.fundTransferSuccessMsg = ''
          }, 3000);

        },
        // client erroe
        (result: any) => {
          this.fundTransferErrorMsg = result.error.message
          setTimeout(() => {
            this.fundTransferErrorMsg = ''
          }, 3000);
        })
    } else {
      alert('Invalid Form')
    }
  }


  // clear fund transfer form
  clearFundTransferForm() {
    this.fundTransferErrorMsg = ''
    this.fundTransferSuccessMsg = ''
    this.transferForm.reset()
  }

  // logout
  logout() {

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('currentAcno')
    this.logoutDiv = true

    // navigate to login by setting timeout
    setTimeout(() => {
      this.router.navigateByUrl('/')
      this.logoutDiv = false
    }, 100);
  }

  // deleteAccountFromNavBar
  deleteAccountFromNavBar() {
    this.acno = localStorage.getItem("currentAcno")
    this.deleteConfirm = true
  }

  onCancel() {
    this.acno = ''
    this.deleteConfirm = false
  }

  onDelete(event: any) {
    let deleteAcno = JSON.parse(event)

    this.api.deleteAccount(deleteAcno).subscribe((result: any) => {
      this.acno = ''
      
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('currentAcno')
      this.deleteSpinnerDiv=true

      // navigate to login by setting timeout
      setTimeout(() => {
        this.router.navigateByUrl('/')
        this.deleteSpinnerDiv=false
      },2000);
    },(result:any)=>{
      alert(result.error.message)
    })
  }

}
