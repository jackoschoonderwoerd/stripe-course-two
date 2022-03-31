import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { convertSnaps } from 'app/services/db-utils';
import { first, map } from 'rxjs/operators';
import { Cd } from '../interfaces/cd';
import { Musician } from '../interfaces/musician';


@Injectable({
    providedIn: 'root'
})
export class CdsService {

    @Output() selectedCds = new EventEmitter<Cd[]>()

    constructor(
        private db: AngularFirestore
    ) { }




    getCds() {
        return this.db.collection('cds')
            .snapshotChanges()
            .pipe(
                map(snaps => convertSnaps<Cd>(snaps)),
                // first()
            )
    }

    getCdById(id: string) {
        console.log(id);
        
        return this.db.collection('cds').doc(id).ref.get()
            .then((doc: any) => {
                if (doc) {
                    console.log(doc.data())
                    const cd: Cd = {
                        id: id,
                        ...doc.data()
                    }
                    return cd
                } else {
                    alert('doc not found')
                }
            })

    }

    getCdsByIds(ids: string[]) {
        
    }

    addCd(cd: Cd): Promise<firebase.firestore.DocumentReference> {
        return this.db.collection('cds').add(cd)
    }

    editCd(cd) {
        console.log(cd);
        const myCd: Cd = {
            cdInfo: cd.cdInfo,
            tracks: cd.tracks,
            musicians: cd.musicians
        }
        return this.db.collection('cds').doc(cd.id).set(myCd)
    }

    deleteCd(id: string) {
        console.log(id);
        // var docRef = this.db.collection('cds').doc(id)
        // return docRef.delete();
        return this.db.collection('cds').doc(id).delete();
    }

    getCdsByMusicanName (name: string) {
        console.log()
        // this.db.collection(
        //     'cds',
        //     ref => ref.where('cdInfo.bandName', '==', 'Victor de Boo')
        //     ).get()
        //     .subscribe(snaps => {
        //         snaps.forEach(snap => {
        //             console.log(snap.id);
        //             console.log(snap.data())
        //         });
        //     })
        return this.db.collection(
            'cds',
            // ref => ref.where('musicians', 'array-contains', 'kaas'))
            )
            .get()
            .subscribe(snaps => {
                console.log(snaps);
                let cds = []
                snaps.forEach((snap) => {
                    console.log(snap.id);
                    console.log(snap.data());
                    cds.push(snap.data());
                })
                console.log(cds)
                let selectedCds = []
                cds.forEach((cd: Cd) => {
                    cd.musicians.forEach((musician: Musician) => {
                        if (musician.name === name) {
                            selectedCds.push(cd)
                        }
                    })
                })
                console.log(selectedCds)
                this.selectedCds.emit(selectedCds);
                return selectedCds;
            })
    
    }
}
