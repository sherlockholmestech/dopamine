import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlaybackInformation } from '../playback-information/playback-information';
import { MediaSessionServiceBase } from './media-session.service.base';
import { PlaybackServiceBase } from '../playback/playback.service.base';
import { PlaybackInformationServiceBase } from '../playback-information/playback-information.service.base';
import { MediaSessionProxyBase } from '../../common/io/media-session-proxy.base';
import { SettingsBase } from '../../common/settings/settings.base';
@Injectable()
export class MediaSessionService implements MediaSessionServiceBase {
    private subscription: Subscription = new Subscription();

    public constructor(
        private playbackService: PlaybackServiceBase,
        private playbackInformationService: PlaybackInformationServiceBase,
        private mediaSessionProxy: MediaSessionProxyBase,
        private settings: SettingsBase,
    ) {}

    public get enableMultimediaKeys(): boolean {
        return this.settings.enableMultimediaKeys;
    }
    public set enableMultimediaKeys(v: boolean) {
        this.settings.enableMultimediaKeys = v;
        this.enableOrDisableMetadataSubscriptions();
        this.enableOrDisableMediaKeys();
    }

    public initialize(): void {
        this.enableOrDisableMetadataSubscriptions();
        this.enableOrDisableMediaKeys();
    }

    private enableOrDisableMediaKeys(): void {
        if (this.settings.enableMultimediaKeys) {
            this.mediaSessionProxy.setActionHandler('play', () => this.playbackService.togglePlayback());
            this.mediaSessionProxy.setActionHandler('pause', () => this.playbackService.togglePlayback());
            this.mediaSessionProxy.setActionHandler('previoustrack', () => this.playbackService.playPrevious());
            this.mediaSessionProxy.setActionHandler('nexttrack', () => this.playbackService.playNext());
        } else {
            this.mediaSessionProxy.clearActionHandler('play');
            this.mediaSessionProxy.clearActionHandler('pause');
            this.mediaSessionProxy.clearActionHandler('previoustrack');
            this.mediaSessionProxy.clearActionHandler('nexttrack');
        }
    }

    private enableOrDisableMetadataSubscriptions(): void {
        if (!this.settings.enableMultimediaKeys) {
            this.subscription.unsubscribe();
            this.mediaSessionProxy.clearMetadata();

            return;
        }

        if (this.settings.enableMultimediaKeys) {
            this.subscription.add(
                this.playbackInformationService.playingNextTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    this.setMetadata(playbackInformation);
                }),
            );

            this.subscription.add(
                this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
                    this.setMetadata(playbackInformation);
                }),
            );
        }
    }

    private setMetadata(playbackInformation: PlaybackInformation): void {
        this.mediaSessionProxy.setMetadata(
            playbackInformation.track?.title ?? '',
            playbackInformation.track?.artists ?? '',
            playbackInformation.track?.albumTitle ?? '',
            playbackInformation.imageUrl,
        );
    }
}
