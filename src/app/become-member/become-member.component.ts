import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ReadyToPayChangeResponse } from '@google-pay/button-angular';

@Component({
  selector: 'app-become-member',
  templateUrl: './become-member.component.html',
  styleUrls: ['./become-member.component.scss']
})
export class BecomeMemberComponent implements OnInit {
  amount = '100.00';
  buttonType = 'buy';
  buttonColor = 'default';
  buttonLocale = '';
  existingPaymentMethodRequired = false;

  paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '12345678901234567890',
      merchantName: 'Demo Merchant',
    },
  };
  profileDetails: any;





  constructor(private router: Router,    private db: AngularFirestore,
    ) {

      const navigation = this.router.getCurrentNavigation();
      console.log(navigation.extras);
      const state = navigation.extras as {
        uidDetails: string;

      };
  
      if (state !== undefined) {

        this.profileDetails = state.uidDetails;
        console.log(this.profileDetails);

  
  
      }
     }

  ngOnInit(): void {
  }

  onLoadPaymentData = (event: CustomEvent<google.payments.api.PaymentData>): void => {
    console.log('load payment data', event.detail);
  };

  onError = (event: ErrorEvent): void => {
    console.error('error', event.error);
  };

  onPaymentDataAuthorized: google.payments.api.PaymentAuthorizedHandler = paymentData => {
    console.log('payment authorized', paymentData);

    return {
      transactionState: 'SUCCESS',
    };
  };

  onReadyToPayChange = (event: CustomEvent<ReadyToPayChangeResponse>): void => {
    console.log('ready to pay change', event.detail);
  };
  

NavigateStart(){
  this.router.navigate(['/loggedin']);

  }

  NewMember(){
    const nextMonth: Date = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 12);
    const newItem = {
      MembershipEnd: nextMonth.toDateString(),
      MembershipType: 'Member',
      memberCheck: true


    }

    this.db.doc<any>('profile/' + this.profileDetails.uid).set(newItem, {merge:true}).then(success=>{});
  }
}
