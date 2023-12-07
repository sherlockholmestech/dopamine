import { Injectable } from '@angular/core';
import { Constants } from '../../common/application/constants';
import { StringUtils } from '../../common/utils/string-utils';
import { PlaylistModel } from './playlist-model';
import { TranslatorServiceBase } from '../translator/translator.service.base';
import { FileAccessBase } from '../../common/io/file-access.base';

@Injectable()
export class PlaylistModelFactory {
    public constructor(
        private translatorService: TranslatorServiceBase,
        private fileAccess: FileAccessBase,
    ) {}

    public create(playlistsParentFolderPath: string, playlistPath: string, playlistImagePath: string): PlaylistModel {
        return new PlaylistModel(
            this.getPlaylistName(playlistPath),
            this.getPlaylistFolderName(playlistsParentFolderPath, playlistPath),
            playlistPath,
            this.getPlaylistImage(playlistImagePath),
        );
    }

    public createDefault(): PlaylistModel {
        return new PlaylistModel('', '', '', Constants.emptyImage);
    }

    private getPlaylistName(playlistPath: string): string {
        return this.fileAccess.getFileNameWithoutExtension(playlistPath);
    }

    private getPlaylistFolderName(playlistsParentFolderPath: string, playlistPath: string): string {
        const directoryPath: string = this.fileAccess.getDirectoryPath(playlistPath);
        let directoryName: string = '';

        if (directoryPath === playlistsParentFolderPath) {
            directoryName = this.translatorService.get('unsorted');
        } else {
            directoryName = this.fileAccess.getDirectoryOrFileName(directoryPath);
        }

        return directoryName;
    }

    private getPlaylistImage(playlistImagePath: string): string {
        if (!StringUtils.isNullOrWhiteSpace(playlistImagePath)) {
            return playlistImagePath;
        }

        return Constants.emptyImage;
    }
}
