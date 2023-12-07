import { Injectable } from '@angular/core';
import { FileFormats } from '../application/file-formats';
import { FileAccessBase } from '../io/file-access.base';

@Injectable()
export class FileValidator {
    public constructor(private fileAccess: FileAccessBase) {}

    public isPlayableAudioFile(filePath: string): boolean {
        if (!this.fileAccess.pathExists(filePath)) {
            return false;
        }

        const fileExtension: string = this.fileAccess.getFileExtension(filePath);

        if (!FileFormats.supportedAudioExtensions.includes(fileExtension.toLowerCase())) {
            return false;
        }

        return true;
    }

    public isSupportedPlaylistFile(filePath: string): boolean {
        const fileExtension: string = this.fileAccess.getFileExtension(filePath);

        if (FileFormats.supportedPlaylistExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }

    public isSupportedPlaylistImageFile(filePath: string): boolean {
        const fileExtension: string = this.fileAccess.getFileExtension(filePath);

        if (FileFormats.supportedPlaylistImageExtensions.includes(fileExtension.toLowerCase())) {
            return true;
        }

        return false;
    }
}
