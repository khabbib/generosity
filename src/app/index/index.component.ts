import {Component, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import SupabaseService from '../shared/supabaseDB';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent {

	projectText: string = '';
	projectName: string = '';
	donationAmount: string = '';
	qrCodeUrl: string | null = null;
	
	localhost: string =  'localhost:3000';
	baseURL: string = "http://" + this.localhost+ "/";
	status: string = "";
	statusColor: string = "";
	identifier: string = "";
	originalPaymentReference: string = "";
	refundIdentifier: string = "";
	pollingInterval: any;
	isDonationInProgress: boolean  = false;
	submitClicked: boolean  = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private supabaseService: SupabaseService ) {
    //alert("Note! Index is Donation page.");

  }
  
  projects = [
    {
      title: 'Revolutionary To-Do List',
      text: 'Say goodbye to ordinary to-do lists! This project brings a revolutionary new way to manage your tasks with added fun features to keep you motivated and productive.',
      imgSrc:"../../assets/projects/Revolutionary To-Do List.jpg",
      link: '#'
    },
    {
      title: 'Smart Home Automation',
      text: 'Automate your home with ease. This project integrates various smart devices into a seamless and easy-to-use system, making your life more convenient and efficient.',
      imgSrc:"../../assets/projects/Smart Home Automation.jpg",
      link: '#'
    },
    {
      title: 'Fitness Tracker Deluxe',
      text: 'Take your fitness journey to the next level with this deluxe tracker. Monitor your progress, set goals, and stay motivated with advanced features and insights.',
      imgSrc:"../../assets/projects/Fitness Tracker Deluxe.jpg",
      link: '#'
    },
    {
      title: 'Eco-Friendly Gardening',
      text: 'Create a sustainable and eco-friendly garden with our innovative tools and tips. This project guides you through building a garden that’s good for you and the planet.',
      imgSrc:"../../assets/projects/Eco-Friendly Gardening.png",
      link: '#'
    },
    {
      title: 'The Great Spaghetti Code Cleanup',
      text: 'Ever felt like your codebase is a plate of tangled spaghetti? Fear not! This project tackles the most chaotic codebases, transforming them into clean, readable, and maintainable works of art. No more noodle nightmares!',
      imgSrc:"../../assets/projects/The Great Spaghetti Code Cleanup.jpg",
      link: '#'
    },
    {
      title: 'AI-Powered Coffee Maker: Java with Java',
      text: 'Tired of manually brewing your coffee every morning? Let our AI-powered coffee maker, coded entirely in Java, do it for you! Wake up to the perfect cup of coffee, every single day, with a touch of programming humor.',
      imgSrc:"../../assets/projects/AI-Powered Coffee Maker- Java with Java.jpg",
      link: '#'
    }
  ]

  handleProjectPicked(project: any) {
	this.isDonationInProgress = true;
    console.log('Picked project:', project);
	this.projectName = project.title
	this.projectText = project.text
    // Handle the picked project as needed
  }
  // handle form submission logic when donation button is clicked
  submitForm() {
	this.startQRPayment();
  }

	startQRPayment() {
		// check if not empty
		if (this.donationAmount.length <= 0) {
			this.updateStatus("Amount is required", "red")
			return
		}

		this.submitClicked = true;
		this.postQRPayment()	
		this.updateStatus("Request sent", "green")
	}

	// api call to perform POST
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
				this.updateStatus("Request failure: " + response.statusText, "red")
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
  
	// get payment status to print
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
			this.updateStatus("Payment(identifier: " + this.identifier + ", paymentReference: "+ this.originalPaymentReference + ") " + json.status, "black")
			if (json.status == "PAID") {
				this.originalPaymentReference = json["paymentReference"];
				const currentDate = new Date(); 
				this.supabaseService.savePayment(this.originalPaymentReference, this.projectName, Number(this.donationAmount), currentDate);
				clearInterval(this.pollingInterval);
				this.clear();
				setTimeout(() => {
						//this.router.navigateByUrl('/thankyou');
						//this.updateStatus("Thanks for donating :)")
						this.isDonationInProgress = false;
						setTimeout(() => {
							location.reload();
							this.submitClicked = false;
						}, 2000)
					}, 3000)
			}
		})
		.catch( (error) => {  
			console.log("Request failure: ", error);  
			clearInterval(this.pollingInterval);
		});
	}

	// payment info
	savePaymentInformation(paymentReference: string, name: any, amount: any, ) {
		console.log("Name: " ,name, " amaount: " , amount);
		console.log("Saving: " , paymentReference)
	}

	// reset
	clear() {
		this.identifier = ""
		this.originalPaymentReference = ""
		this.refundIdentifier = ""
		this.projectName = ""
		this.donationAmount = ""
	}
	
	// status of the respons
	updateStatus(status: string, statusColor : string) {
			this.status = status
			this.statusColor = statusColor
	}
	paymentStatusClick() {
		const id = this.identifier
		if (!id || id.length <= 0) {
			this.updateStatus("No payment Id", "black")
			return
		}
		this.getPaymentStatus(id)
	}
	
}
