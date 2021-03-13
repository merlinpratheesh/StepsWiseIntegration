import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { LoggedinStartComponent } from './loggedin-start/loggedin-start.component';
import { OfflineScreenComponent } from './offline-screen/offline-screen.component';
import { StarttestComponent } from './starttest/starttest.component';
import { ProfileComponent } from './profile/profile.component';
import { MainScreen2Component } from './main-screen2/main-screen2.component';
const routes: Routes = [
  { path: 'start', component: StartScreenComponent },
  { path: 'main', component: MainScreenComponent },
  { path: 'loggedin', component: LoggedinStartComponent },
  { path: 'offline', component: OfflineScreenComponent },
  { path: 'starttest', component: StarttestComponent },
  {path:'main2',component:MainScreen2Component}  ,



  { path: '',   redirectTo: '/starttest', pathMatch: 'full' }


];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
