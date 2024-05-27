import {Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {

  projectName: string = '';
  donationAmount: string = '';

  baseURL: string = "http://" + window.location.host + "/";
	commerceType: string = "ecom";
	identifier: string = "";
	originalPaymentReference: string = "";
	refundIdentifier: string = "";

  constructor(private router: Router) {
    //alert("Note! Index is Donation page.");
  }

  // handle form submission logic when donation button is clicked
  submitForm() {
    // set items to local storage
    localStorage.setItem("project-name", this.projectName);
    localStorage.setItem("donation-amount", this.donationAmount);

    // console log to check the values
    console.log('Form submitted!');
    console.log('Project Name:', this.projectName);
    console.log('Donation Amount:', this.donationAmount);
    // alert("DONE");

    // CALL API HERE

    // ...

    // success or failed
    if(true) { // if payment went well
      this.router.navigateByUrl('/thankyou');
    } else { // payment failed
      alert("Failed to donate. Please try again");
    }

  }

  clear() {
    this.identifier = ""
		this.originalPaymentReference = ""
		this.refundIdentifier = ""
  }
  

}
