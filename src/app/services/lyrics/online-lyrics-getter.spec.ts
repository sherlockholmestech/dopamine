import { MockCreator } from '../../testing/mock-creator';
import { LyricsModel } from './lyrics-model';
import { LyricsSourceType } from '../../common/api/lyrics/lyrics-source-type';
import { TrackModel } from '../track/track-model';
import { OnlineLyricsGetter } from './online-lyrics-getter';
import { IMock, It, Mock, Times } from 'typemoq';
import { Lyrics } from '../../common/api/lyrics/lyrics';
import { Logger } from '../../common/logger';
import { ChartLyricsApi } from '../../common/api/lyrics/chart-lyrics.api';
import { AZLyricsApi } from '../../common/api/lyrics/a-z-lyrics.api';
import { WebSearchLyricsApi } from '../../common/api/lyrics/web-search-lyrics/web-search-lyrics.api';

describe('OnlineLyricsGetter', () => {
    let chartLyricsApiMock: IMock<ChartLyricsApi>;
    let azLyricsApiMock: IMock<AZLyricsApi>;
    let webSearchLyricsApiMock: IMock<WebSearchLyricsApi>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        chartLyricsApiMock = Mock.ofType<ChartLyricsApi>();
        azLyricsApiMock = Mock.ofType<AZLyricsApi>();
        webSearchLyricsApiMock = Mock.ofType<WebSearchLyricsApi>();
        loggerMock = Mock.ofType<Logger>();
    });

    function createInstance(): OnlineLyricsGetter {
        return new OnlineLyricsGetter(chartLyricsApiMock.object, azLyricsApiMock.object, webSearchLyricsApiMock.object, loggerMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange, Act
            const instance: OnlineLyricsGetter = createInstance();

            // Assert
            expect(instance).toBeDefined();
        });
    });

    describe('getLyricsAsync', () => {
        it('should return empty lyrics if track has no artist and title', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', '', '');
            const lyrics: Lyrics = new Lyrics('ChartLyrics source', 'ChartLyrics text');
            const instance: OnlineLyricsGetter = createInstance();

            // Act
            const lyricsModel: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            chartLyricsApiMock.verify((x) => x.getLyricsAsync(It.isAny(), It.isAny()), Times.never());
            azLyricsApiMock.verify((x) => x.getLyricsAsync(It.isAny(), It.isAny()), Times.never());
            webSearchLyricsApiMock.verify((x) => x.getLyricsAsync(It.isAny(), It.isAny()), Times.never());
            expect(lyricsModel.track).toEqual(track);
            expect(lyricsModel.sourceName).toEqual('');
            expect(lyricsModel.sourceType).toEqual(LyricsSourceType.none);
            expect(lyricsModel.text).toEqual('');
        });

        it('should return lyrics from ChartLyrics if available', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', 'title', 'artists');
            const lyrics: Lyrics = new Lyrics('ChartLyrics source', 'ChartLyrics text');
            chartLyricsApiMock.setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle)).returns(() => Promise.resolve(lyrics));
            const instance: OnlineLyricsGetter = createInstance();

            // Act
            const lyricsModel: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyricsModel.track).toEqual(track);
            expect(lyricsModel.sourceName).toEqual('ChartLyrics source');
            expect(lyricsModel.sourceType).toEqual(LyricsSourceType.online);
            expect(lyricsModel.text).toEqual('ChartLyrics text');
        });

        it('should return lyrics from AZLyrics if no lyrics from ChartLyrics are available', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', 'title', 'artists');
            const lyrics: Lyrics = new Lyrics('AZLyrics source', 'AZLyrics text');
            chartLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(Lyrics.empty()));
            azLyricsApiMock.setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle)).returns(() => Promise.resolve(lyrics));
            const instance: OnlineLyricsGetter = createInstance();

            // Act
            const lyricsModel: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyricsModel.track).toEqual(track);
            expect(lyricsModel.sourceName).toEqual('AZLyrics source');
            expect(lyricsModel.sourceType).toEqual(LyricsSourceType.online);
            expect(lyricsModel.text).toEqual('AZLyrics text');
        });

        it('should return lyrics from WebSearchLyrics if no lyrics from ChartLyrics and AZLyrics are available', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', 'title', 'artists');
            const lyrics: Lyrics = new Lyrics('WebSearchLyrics source', 'WebSearchLyrics text');
            chartLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(Lyrics.empty()));
            azLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(Lyrics.empty()));
            webSearchLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(lyrics));
            const instance: OnlineLyricsGetter = createInstance();

            // Act
            const lyricsModel: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyricsModel.track).toEqual(track);
            expect(lyricsModel.sourceName).toEqual('WebSearchLyrics source');
            expect(lyricsModel.sourceType).toEqual(LyricsSourceType.online);
            expect(lyricsModel.text).toEqual('WebSearchLyrics text');
        });

        it('should return empty lyrics if no online lyrics are availalble', async () => {
            // Arrange
            const track: TrackModel = MockCreator.createTrackModel('path', 'title', 'artists');
            chartLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(Lyrics.empty()));
            azLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(Lyrics.empty()));
            webSearchLyricsApiMock
                .setup((x) => x.getLyricsAsync(track.rawFirstArtist, track.rawTitle))
                .returns(() => Promise.resolve(Lyrics.empty()));
            const instance: OnlineLyricsGetter = createInstance();

            // Act
            const lyricsModel: LyricsModel = await instance.getLyricsAsync(track);

            // Assert
            expect(lyricsModel.track).toEqual(track);
            expect(lyricsModel.sourceName).toEqual('');
            expect(lyricsModel.sourceType).toEqual(LyricsSourceType.none);
            expect(lyricsModel.text).toEqual('');
        });
    });
});
