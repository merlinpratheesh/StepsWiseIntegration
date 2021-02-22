import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { LoggedinStartComponent } from './loggedin-start/loggedin-start.component';
import { OfflineScreenComponent } from './offline-screen/offline-screen.component';
const routes: Routes = [
  { path: 'start', component: StartScreenComponent },
  { path: 'main', component: MainScreenComponent },
  { path: 'loggedin', component: LoggedinStartComponent },
  { path: 'offline', component: OfflineScreenComponent },
  { path: '',   redirectTo: '/start', pathMatch: 'full' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
