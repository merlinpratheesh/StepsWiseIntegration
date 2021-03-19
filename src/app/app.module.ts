import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSharedModule } from './app-shared/app-shared.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment'
import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { LoggedinStartComponent,BottomSheetOverviewExampleSheet} from './loggedin-start/loggedin-start.component';
import { OfflineScreenComponent } from './offline-screen/offline-screen.component';
import { NestedTreeComponent,BottomSheetChangeOrder } from './nested-tree/nested-tree.component';
import { AddNodeComponent,NewNodeDialog } from './nested-tree/add-node/add-node.component';
import { DeleteNodeComponent, } from './nested-tree/delete-node/delete-node.component';
import { EditNodeComponent,EditNodeDialog } from './nested-tree/edit-node/edit-node.component';
import { ShowmoreDirective } from './showmore.directive';
import { StarttestComponent } from './starttest/starttest.component';
import { SingletaskComponent } from './singletask/singletask.component';
import { AddNewProjectDialog, ToolbarComponent,ViewProfileDialog  } from './toolbar/toolbar.component';
import { ProfileComponent } from './profile/profile.component';
import { MainScreen2Component,DialogEditTestcase } from './main-screen2/main-screen2.component';


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInOptions: [
      {
        // Google provider must be enabled in Firebase Console to support one-tap
        // sign-up.
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // Required to enable ID token credentials for this provider.
        // This can be obtained from the Credentials page of the Google APIs
        // console. Use the same OAuth client ID used for the Google provider
        // configured with GCIP or Firebase Auth.
        clientId: '325755404242-i8ufs5g8moq28o4oh38nv6qf3cbbt1gd.apps.googleusercontent.com'
      }],

    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO

  };


@NgModule({
  declarations: [
    AppComponent,
    DialogEditTestcase,
    StartScreenComponent,
    MainScreenComponent,
    LoggedinStartComponent,
    OfflineScreenComponent,BottomSheetOverviewExampleSheet,
    AddNewProjectDialog,EditNodeComponent,EditNodeDialog,NestedTreeComponent,ViewProfileDialog,
    BottomSheetChangeOrder,AddNodeComponent,NewNodeDialog,DeleteNodeComponent, ShowmoreDirective, StarttestComponent, SingletaskComponent, ToolbarComponent, ProfileComponent, MainScreen2Component  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppSharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
    ,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  entryComponents:[DialogEditTestcase],
  providers: [AddNewProjectDialog,BottomSheetOverviewExampleSheet,ViewProfileDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
