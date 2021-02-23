import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { collectionData, doc } from 'rxfire/firestore';
import { first, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

export interface userProfile {
  userAuthenObj: firebase.User
}


export interface projectDetails {
  projectName: string;//Heading in testcase list
  description: string;//Sub-Heading in testcase list
  photoUrl: string;//Description in testcase view
  projectUid: string;//stackblitzLink in testcase edit/doubleclick
  creationDate: string;
  profileName: string;
}
export interface SubSection {
  viewvalue: string;
}

export interface MainSectionGroup {
  disabled: boolean;
  name: string;
  section: SubSection[];
}
export interface usrinfoDetails {
  projectName:string,
  profileName: string,
  email?: string,
  gender?: string,
  areaOfinterest?: string,
  skills?: string,
  location?: string,
  membershipEnd?:firebase. firestore. Timestamp;
  membershipType?: string,
  projectLocation?: string,
  photoUrl: string,
}
export interface projectControls {
  editProfileGroup?: FormGroup;
}


@Injectable({
  providedIn: 'root'
})

export class UserdataService {

  isOnline$!: Observable<boolean>;


  constructor(private db: AngularFirestore) {
    this.isOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }

  async addPrivateList (value: any, uidtoupdate: string) : Promise<void>{
    console.log(value);
    /*await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc('/privateProject/'+`${uidtoupdate}`+'/private/AngularProject').update(value),
      ]);
      return promise;
    });*/
  }

  async addPublicList (value: any) : Promise<void>{
    console.log(value);

  }

  async updateProfile (value: any, uidtoupdate: string) : Promise<void>{
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc('profile/' + `${uidtoupdate}`).update(value),
      ]);
      return promise;
    });
  }
  docExists(uid: string):any {
    return this.db.doc(`profile/` + `${uid}`).valueChanges().pipe(first()).toPromise();
  }
  async findOrCreate(uid: string) :Promise<usrinfoDetails> {
    const doc:usrinfoDetails = await this.docExists(uid);
    if (doc) {
      console.log('returned', doc);
      return doc;
    } else {
      return undefined;
    }
  }
  


  async createnewproject( updatedProject:any,uid:string): Promise<void> {
    console.log(updatedProject);
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([

      this.db.collection('projectList/').doc(uid).update(
        {private:firebase.firestore.FieldValue.arrayUnion(updatedProject),
        }),
      
      this.db.collection('projectList/').doc('publicProject').update(
          {public:firebase.firestore.FieldValue.arrayUnion(updatedProject),

        })]);
        
      return promise;
    });
  }

  async createDefKeys(projectname: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.firestore.doc('publicProjectKeys/' + projectname).set({ MainSection }, { merge: false }),
        this.db.firestore.doc(projectname + '/MainSection/items/SubSection').delete()
      ]);
      return promise;
    });
  }
  async deleteproject(uid: string, oldprojectName: string, newprojectinfo: any): Promise<void> {
    console.log('oldprojectName', oldprojectName);
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.firestore.doc('projectList/' + uid).update({ ownerRecord: firebase.firestore.FieldValue.arrayRemove(oldprojectName) }),
        this.db.firestore.doc('projectList/' + 'publicProjects').update({ public: firebase.firestore.FieldValue.arrayRemove(oldprojectName) }),
        this.db.firestore.doc('myProfile/' + uid).set(newprojectinfo, { merge: true }),
        this.db.firestore.doc('publicProjectKeys/' + oldprojectName).delete()
      ]);
      return promise;
    });
  }
  async deleteMainSection(ProjectName: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc('publicProjectKeys/' + ProjectName).set({ MainSection }, { merge: false })
      ]);
      return promise;
    });
  }
  async addMainSection(ProjectName: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      console.log('reached', ProjectName);
      const promise = Promise.all([
        this.db.doc('/publicProjectKeys/' + ProjectName).set({ MainSection }, { merge: false })
      ]);
      return promise;
    });
  }
  async updatevisibility(ProjectName: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc('publicProjectKeys/' + ProjectName).set({ MainSection }, { merge: false })
      ]);
      return promise;
    });
  }
  async addSubSection(ProjectName: string, MainSectionName: string, SubSectionName: string, MainSection: any): Promise<void> {
    console.log('195', ProjectName);
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc('publicProjectKeys/' + ProjectName).set({ MainSection }, { merge: false }),
        this.db.doc(ProjectName + '/' + MainSectionName + '/items/' + SubSectionName).delete()
      ]);
      return promise;
    });
  }
  async deleteSubSection(ProjectName: string, MainSectionName: string, SubSectionName: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc(ProjectName + '/' + MainSectionName + '/items/' + SubSectionName + '/').delete(),
        this.db.doc('publicProjectKeys/' + ProjectName).set({ MainSection }, { merge: false })
      ]);
      return promise;
    });
  }
  async updateSubSection(ProjectName: string, MainSectionName: string, SubSectionName: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.db.doc(ProjectName + '/' + MainSectionName + '/items/' + SubSectionName + '/').delete(),
        this.db.doc('publicProjectKeys/' + ProjectName).set({ MainSection }),
      ]);
      return promise;
    });
  }
  async UpdateMainSection(ProjectName: string, MainSection: any): Promise<void> {
    await this.db.firestore.runTransaction(() => {
      console.log('reached', ProjectName);
      const promise = Promise.all([
        this.db.doc('/publicProjectKeys/' + ProjectName).set({ MainSection }, { merge: false })
      ]);
      return promise;
    });
  }
}
