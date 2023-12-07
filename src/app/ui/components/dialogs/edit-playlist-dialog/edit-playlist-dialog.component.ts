import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constants } from '../../../../common/application/constants';
import { StringUtils } from '../../../../common/utils/string-utils';
import { PromiseUtils } from '../../../../common/utils/promise-utils';
import { PlaylistData } from '../../../../services/dialog/playlist-data';
import { PlaylistServiceBase } from '../../../../services/playlist/playlist.service.base';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { DesktopBase } from '../../../../common/io/desktop.base';

@Component({
    selector: 'app-edit-playlist-dialog',
    templateUrl: './edit-playlist-dialog.component.html',
    styleUrls: ['./edit-playlist-dialog.component.scss'],
})
export class EditPlaylistDialogComponent implements OnInit {
    public constructor(
        @Inject(MAT_DIALOG_DATA) public data: PlaylistData,
        private dialogRef: MatDialogRef<EditPlaylistDialogComponent, boolean>,
        private playlistService: PlaylistServiceBase,
        private translatorService: TranslatorServiceBase,
        private desktop: DesktopBase,
    ) {
        dialogRef.disableClose = true;
    }

    public playlistName: string = '';
    public playlistImagePath: string = '';

    public get dialogTitle(): string {
        if (this.hasPlaylistName) {
            return this.translatorService.get('edit-playlist');
        }

        return this.translatorService.get('create-playlist');
    }

    public get hasPlaylistName(): boolean {
        return !StringUtils.isNullOrWhiteSpace(this.playlistName);
    }

    public get hasPlaylistImagePath(): boolean {
        return this.playlistImagePath !== Constants.emptyImage;
    }

    public ngOnInit(): void {
        this.dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
            if (result != undefined && result) {
                PromiseUtils.noAwait(this.updatePlaylistAsync());
            }
        });

        this.playlistName = this.data.playlist.name;
        this.playlistImagePath = this.data.playlist.imagePath;
    }

    public closeDialog(): void {
        if (this.hasPlaylistName) {
            this.dialogRef.close(true); // Force return "true"
        }
    }

    public async changeImageAsync(): Promise<void> {
        const selectedFile: string = await this.desktop.showSelectFileDialogAsync(this.translatorService.get('choose-image'));

        if (!StringUtils.isNullOrWhiteSpace(selectedFile)) {
            this.playlistImagePath = selectedFile;
        }
    }

    public removeImage(): void {
        this.playlistImagePath = Constants.emptyImage;
    }

    private async updatePlaylistAsync(): Promise<void> {
        try {
            await this.playlistService.updatePlaylistDetailsAsync(this.data.playlist, this.playlistName, this.playlistImagePath);
        } catch (e: unknown) {
            // TODO
        }
    }
}
