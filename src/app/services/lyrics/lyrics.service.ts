import { Injectable } from '@angular/core';
import { TrackModel } from '../track/track-model';
import { EmbeddedLyricsGetter } from './embedded-lyrics-getter';
import { LrcLyricsGetter } from './lrc-lyrics-getter';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { StringUtils } from '../../common/utils/string-utils';
import { SettingsBase } from '../../common/settings/settings.base';
import { LyricsModel } from './lyrics-model';
import { Logger } from '../../common/logger';
import { LyricsServiceBase } from './lyrics.service.base';

@Injectable()
export class LyricsService implements LyricsServiceBase {
    public constructor(
        private embeddedLyricsGetter: EmbeddedLyricsGetter,
        private lrcLyricsGetter: LrcLyricsGetter,
        private onlineLyricsGetter: OnlineLyricsGetter,
        private settings: SettingsBase,
        private logger: Logger,
    ) {}

    private cachedLyrics: LyricsModel | undefined;

    public async getLyricsAsync(track: TrackModel): Promise<LyricsModel> {
        let lyrics: LyricsModel = LyricsModel.empty(track);

        try {
            lyrics = await this.embeddedLyricsGetter.getLyricsAsync(track);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get embedded lyrics', 'LyricsService', 'getLyricsAsync');
        }

        if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
            return lyrics;
        }

        try {
            lyrics = await this.lrcLyricsGetter.getLyricsAsync(track);
        } catch (e: unknown) {
            this.logger.error(e, 'Could not get LRC lyrics', 'LyricsService', 'getLyricsAsync');
        }

        if (!StringUtils.isNullOrWhiteSpace(lyrics.text)) {
            return lyrics;
        }

        if (this.cachedLyrics?.track != undefined && track != undefined && this.cachedLyrics.track.path === track.path) {
            return this.cachedLyrics;
        }

        if (this.settings.downloadLyricsOnline) {
            try {
                lyrics = await this.onlineLyricsGetter.getLyricsAsync(track);
            } catch (e: unknown) {
                this.logger.error(e, 'Could not get online lyrics', 'LyricsService', 'getLyricsAsync');
            }
        }

        this.cachedLyrics = lyrics;

        return lyrics;
    }
}
