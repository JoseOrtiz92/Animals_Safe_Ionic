import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';

@Injectable()
export class PushnotificationProvider {

  constructor( private oneSignal: OneSignal, public platform: Platform) {
    
  }

  init_push(){

    if (this.platform.is('cordova')) {
      
      this.oneSignal.startInit('a20ec93e-e20d-47a6-9aba-012f30f7d42c', '482500633636');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();
    }
    
  }

}
