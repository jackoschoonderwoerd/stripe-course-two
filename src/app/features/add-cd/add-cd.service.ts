import { EventEmitter, Injectable, Output } from '@angular/core';
import { Track } from '../../core/interfaces/track';
import { Cd } from '../../core/interfaces/cd';
import { CdInfo } from './../../core/interfaces/cd'
import { Musician } from 'app/core/interfaces/musician';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { AngularFireStorage } from '@angular/fire/storage';
import { concatMap, finalize, catchError, last, tap, map } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AddCdService {

    tracks: Track[] = []

    @Output() ImageUrlChanged = new EventEmitter<string>();

    constructor(
        private storage: AngularFireStorage) { }


    uploadImageToBucket(file: File) {
        const filePath = 'shop-items/' + file.name
        console.log(filePath)
        const storageLocation = filePath.split('.')[0] + '_640x640' + '.' + 'jpeg'
        console.log(storageLocation);
        const task = this.storage.upload(filePath, file, {
            cacheControl: 'max-age=2592000,public'
        });
        return task.snapshotChanges()
            .pipe(
                last(),
                concatMap(() => this.storage.ref(filePath).getDownloadURL()),
                tap(imageUrl => {
                    console.log(imageUrl);
                    // return(imageUrl)
                    const newFilePath = filePath.split('.')[0] + '_640x640' + '.' + 'jpeg'
                    return this.keepTrying(10, newFilePath);
                }),
                catchError(err => {
                    console.log(err);
                    alert('could not create thumbnail url');
                    return throwError(err)
                })
            )
    }

    keepTrying(triesRemaining, newFilePath) {
        console.log(triesRemaining, newFilePath)
        if (triesRemaining < 0) {
            return Promise.reject('out of tries')
        }
        const storageRef = this.storage.storage.ref().child(newFilePath);
        return storageRef.getDownloadURL()
            .then((url: string) => {
                console.log(url)
                this.ImageUrlChanged.emit(url);
                return url;
            })
            .catch((error) => {
                switch (error.code) {
                    case 'storage/object-not-found':
                        console.log(error.code)
                        return setTimeout(() => {
                            return this.keepTrying(triesRemaining - 1, newFilePath)
                        }, 2000);
                    default: {
                        console.log(error);
                        return Promise.reject(error)
                    }
                }
            })
    }
}

