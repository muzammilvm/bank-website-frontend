import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

const options = {
  headers: new HttpHeaders()
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  register(uname: any, acno: any, pass: any) {
    const body = {
      uname,
      acno,
      pass
    }

    return this.http.post('http://localhost:3000/register', body)
  }

  login(acno: any, pass: any) {
    const body = {
      acno,
      pass
    }
    // server call
    return this.http.post('http://localhost:3000/login', body)
  }

  // function appending token for http header
  appendToken() {

    // fetch token from local storage
    const token = localStorage.getItem('token') || ''

    // create http header
    var headers = new HttpHeaders()
    if (token) {
      // append token inside headers
      headers = headers.append('acces-token', token)
      options.headers = headers
    }
    return options
  }

  getBalance(acno: any) {
    return this.http.get('http://localhost:3000/getBalance/' + acno, this.appendToken())
  }

  // deposit
  deposit(acno: any, amount: any) {
    const body = {
      acno,
      amount
    }
    return this.http.post('http://localhost:3000/deposit', body, this.appendToken())
  }

  // fund transfer
  transfer(toAcno: any, pass: any, amount: any) {
    const body = {
      toAcno,
      pass,
      amount
    }
    return this.http.post('http://localhost:3000/fundTransfer', body, this.appendToken())
  }

  // get all transaction
  getAllTransactions(){
    return this.http.get('http://localhost:3000/all-transactions',this.appendToken())
  }

  // deleteAccount
  deleteAccount(acno:number){
    return this.http.delete('http://localhost:3000/delete-account/'+acno,this.appendToken())

  }


}
