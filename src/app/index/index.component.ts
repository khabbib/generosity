import {Component, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {

  projectName: string = '';
  donationAmount: string = '';
  qrCodeUrl: string | null = null;

  localhost: string =  'localhost:3000';
  baseURL: string = "http://" + this.localhost+ "/";
status: string = "";
identifier: string = "";
originalPaymentReference: string = "";
refundIdentifier: string = "";

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    //alert("Note! Index is Donation page.");
  }

  // handle form submission logic when donation button is clicked
  submitForm() {
	this.startQRPayment();

    // set items to local storage
    localStorage.setItem("project-name", this.projectName);
    localStorage.setItem("donation-amount", this.donationAmount);
    // alert("DONE");

    // CALL API HERE

    // ...

    // success or failed
    // if(true) { // if payment went well
    //   this.router.navigateByUrl('/thankyou');
    // } else { // payment failed
    //   alert("Failed to donate. Please try again");
    // }

  }


  startQRPayment() {
		if (this.donationAmount.length <= 0) {
			this.updateStatus("Amount is required")
			return
		}

		this.postQRPayment(this.updateStatus.bind(this), this.identifier, this.baseURL, this.qrCodeUrl)	
		this.updateStatus("Request sent")
	}

  postQRPayment( 
    updateStatus : (status: string) => void,
    identifier: string,
    baseURL: string,
    qrCodeUrl: string | null,
    ) {

		const url = this.baseURL + "paymentrequests"
		fetch(url, {  
			method: 'POST',  
			headers: {
				'Content-Type': 'application/json'
			},  
			body: JSON.stringify({
				amount: this.donationAmount,
				project: this.projectName
			})
		})
		.then(function(response) {
			if (response.status != 201) {
				updateStatus("Request failure: " + response.statusText)
				return
			}
			return response.json();
		})
		.then((json) => {
			if (json) {
				identifier = json["id"];
				const token = json["token"];
				const url = baseURL + "qr/" + token
				fetch(url, {  
					method: 'GET',  
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then((response) => {
					return response.blob();
				})
				.then((blob) => {
					var objectURL = URL.createObjectURL(blob);
					qrCodeUrl = objectURL;
					this.qrCodeUrl = objectURL;
					// this.cdr.detectChanges();
					return blob
				})
				.catch(function (error) {  
					console.log("Request failure: ", error);  
				});
			}
		})
		.catch(function (error) {  
			console.log("Request failure: ", error);  
		});
	}
  

  getPaymentStatus(
    id: string, 
    updateStatus: (status: string) => void, 
    originalPaymentReference: string,
    identifier: string,
    ) {

		const url = this.baseURL + "paymentrequests/" + id

		fetch(url, {  
			method: 'GET',  
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			if (json.status == "PAID") {
				originalPaymentReference = json["paymentReference"];
			}
			updateStatus("Payment(identifier: " + identifier + ", paymentReference: "+ originalPaymentReference + ") " + json.status)
		})
		.catch(function (error) {  
			console.log("Request failure: ", error);  
		});
	}

	clear() {
		this.identifier = ""
			this.originalPaymentReference = ""
			this.refundIdentifier = ""
	  }
	
	  updateStatus(status: string) {
				this.status = status
	  }
	
	
		paymentStatusClick() {
			const id = this.identifier
			if (!id || id.length <= 0) {
				this.updateStatus("No payment Id")
				return
			}
			this.getPaymentStatus(id, this.updateStatus.bind(this),  this.originalPaymentReference, this.identifier)
		}
	

}
