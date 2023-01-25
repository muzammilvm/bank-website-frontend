import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  allTransactions: any
  searchKey: string = ''
  

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.api.getAllTransactions().subscribe((result: any) => {
      this.allTransactions = result.transaction
      console.log(this.allTransactions);

    })

    if(!localStorage.getItem('token')){
      alert('Please Login')
      this.router.navigateByUrl('')
    }
  }

  search(event: any) {
    this.searchKey = event.target.value

  }

  generatePDF() {
    var pdf = new jspdf()
    let col = ['Type', 'FromAcno', 'toAcno', 'Amount']
    let row: any = []

    pdf.setFontSize(16);
    pdf.text('Tarnsaction Statement', 1, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    // convert allTransaction to nested array
    var itemNew=this.allTransactions

    // by using forEach
    // Object.keys(itemNew).forEach(key=>{
    //   console.log(itemNew[key]);
    //   var temp =[itemNew[key].type,itemNew[key].fromAcno,itemNew[key].toAcno,itemNew[key].amount]
    //   row.push(temp)
    // })

    for(let element of itemNew){
      console.log(element);
      
      var temp =[element.type,element.fromAcno,element.toAcno,element.amount]
      row.push(temp)
    }

    (pdf as any).autoTable(col,row,{startY:10})

    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow')

    // Download PDF doc  
    pdf.save('Ministatement.pdf');
  }
}
