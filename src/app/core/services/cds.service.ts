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

    @Output() selectedCds = new EventEmitter<Cd[]>();
    @Output() queryOptionsEmitter = new EventEmitter<string[]>();
    @Output() filterClosedEmitter = new EventEmitter<void>();
    @Output() setViewTypeEmitter = new EventEmitter<string>();

    constructor(
        private db: AngularFirestore
    ) { }


    setViewType(viewType: string) {
        this.setViewTypeEmitter.emit(viewType);
    }

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

    addCd(cd: Cd): Promise<firebase.firestore.DocumentReference> {
        console.log(cd);
        return this.db.collection('cds').add(cd)
    }

    editCd(cd) {
        console.log(cd);
        const myCd: Cd = {
            cdInfo: cd.cdInfo,
            tracks: cd.tracks,
            musicians: cd.musicians,
            queryStrings: cd.queryStrings,
            reviews: cd.reviews
        }
        return this.db.collection('cds').doc(cd.id).set(myCd)
    }

    deleteCd(id: string) {
        console.log(id);
        // var docRef = this.db.collection('cds').doc(id)
        // return docRef.delete();
        return this.db.collection('cds').doc(id).delete();
    }

    getCdsByQueryString(queryString: string) {
        if (queryString) {
            console.log(queryString)
            queryString = queryString.toLowerCase()
            console.log(queryString)
            return this.db.collection(
                'cds',
                // ref => ref.where('musicians.name', '==', 'Victor de Boo'))
                ref => ref.where('queryStrings', 'array-contains', queryString))
                .get()
                .subscribe(snaps => {
                    let cds: Cd[] = []
                    snaps.forEach((snap: any) => {

                        console.log(snap.id);
                        console.log(snap.data())
                        cds.push({
                            id: snap.id,
                            ...snap.data()
                        })
                    });
                    console.log(cds);
                    this.selectedCds.emit(cds);

                })
        } else {
            return this.db.collection('cds')
                .get()
                .subscribe(snaps => {
                    let cds: Cd[] = []
                    snaps.forEach((snap: any) => {

                        console.log(snap.id);
                        console.log(snap.data())
                        cds.push({
                            id: snap.id,
                            ...snap.data()
                        })
                    });
                    console.log(cds);
                    this.selectedCds.emit(cds);
                })
        }
    }
    getAllQueryOptions() {
        let queryOptions: string[] = [];
        this.db.collection('cds')
            .get()
            .subscribe(snaps => {
                snaps.forEach((snap => {
                    if (snap.data().queryStrings) {

                        const queryStrings: string[] = snap.data().queryStrings
                        queryStrings.forEach((queryString: string) => {
                            if (queryOptions.indexOf(queryString) == -1) {
                                queryOptions.push(queryString)
                            }
                        })
                    }
                }))
                this.queryOptionsEmitter.emit(queryOptions);
            })



    }
}
