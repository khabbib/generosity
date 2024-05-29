import {Component, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import SupabaseService from '../shared/supabaseDB';



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
	pollingInterval: any;

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

		this.postQRPayment()	
		this.updateStatus("Request sent")
	}

  postQRPayment() {

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
		.then((response) => {
			if (response.status != 201) {
				this.updateStatus("Request failure: " + response.statusText)
				return
			}
			return response.json();
		})
		.then((json) => {
			if (json) {
				this.identifier = json["id"];
				const token = json["token"];
				const url = this.baseURL + "qr/" + token
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
					this.qrCodeUrl = objectURL;
					this.pollingInterval = setInterval(() => {
						if (this.identifier) {
						  this.getPaymentStatus(this.identifier);
						}
					}, 1000);
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
    ) {

		const url = this.baseURL + "paymentrequests/" + id

		fetch(url, {  
			method: 'GET',  
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			this.updateStatus("Payment(identifier: " + this.identifier + ", paymentReference: "+ this.originalPaymentReference + ") " + json.status)
			if (json.status == "PAID") {
				this.originalPaymentReference = json["paymentReference"];
				console.log("In main doing DB")
				const supabaseService = SupabaseService.getInstance();
				const currentDate = new Date(); 
				supabaseService.savePayment(this.originalPaymentReference, this.projectName,Number(this.donationAmount),currentDate)
				clearInterval(this.pollingInterval);
				this.clear();
				setTimeout(() => {
						// this.router.navigateByUrl('/thankyou');
						this.qrCodeUrl = ""
						this.updateStatus("thanks for donating :)")
					}, 3000)
			}
		})
		.catch( (error) => {  
			console.log("Request failure: ", error);  
			clearInterval(this.pollingInterval);
		});
	}


	savePaymentInformation(paymentReference: string, name: any, amount: any, ) {
		console.log("Name: " ,name, " amaount: " , amount);
		console.log("Saving: " , paymentReference)
	}
	clear() {
		this.identifier = ""
		this.originalPaymentReference = ""
		this.refundIdentifier = ""
		this.projectName = ""
		this.donationAmount = ""
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
		this.getPaymentStatus(id)
	}
	

}
