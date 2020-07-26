import { Injectable } from '@angular/core';
import { TrackAdder } from './track-adder';
import { TrackRemover } from './track-remover';
import { TrackUpdater } from './track-updater';

@Injectable({
    providedIn: 'root'
})
export class CollectionIndexer {
    constructor(
        private trackRemover: TrackRemover,
        private trackUpdater: TrackUpdater,
        private trackAdder: TrackAdder
    ) { }

    public async indexCollectionAsync(): Promise<void> {
        this.trackRemover.removeTracksThatDoNoNotBelongToFolders();
        this.trackRemover.removeTracksThatAreNotFoundOnDisk();
        await this.trackUpdater.updateTracksThatAreOutOfDateAsync();
        this.trackAdder.addTracksThatAreNotInTheDatabase();
    }
}
