import { IMock, Mock, Times } from 'typemoq';
import { Logger } from '../../common/logger';
import { AlbumArtworkAdder } from './album-artwork-adder';
import { AlbumArtworkIndexer } from './album-artwork-indexer';
import { AlbumArtworkRemover } from './album-artwork-remover';
import { SnackBarServiceBase } from '../snack-bar/snack-bar.service.base';
import { AlbumArtworkRepositoryBase } from '../../data/repositories/album-artwork-repository.base';
import { TrackRepository } from '../../data/repositories/track-repository';

describe('AlbumArtworkIndexer', () => {
    let trackRepositoryMock: IMock<TrackRepository>;
    let albumArtworkRepository: IMock<AlbumArtworkRepositoryBase>;
    let albumArtworkRemoverMock: IMock<AlbumArtworkRemover>;
    let albumArtworkAdderMock: IMock<AlbumArtworkAdder>;
    let snackBarServiceMock: IMock<SnackBarServiceBase>;
    let loggerMock: IMock<Logger>;
    let albumArtworkIndexer: AlbumArtworkIndexer;

    beforeEach(() => {
        trackRepositoryMock = Mock.ofType<TrackRepository>();
        albumArtworkRepository = Mock.ofType<AlbumArtworkRepositoryBase>();
        albumArtworkRemoverMock = Mock.ofType<AlbumArtworkRemover>();
        albumArtworkAdderMock = Mock.ofType<AlbumArtworkAdder>();
        snackBarServiceMock = Mock.ofType<SnackBarServiceBase>();
        loggerMock = Mock.ofType<Logger>();
        albumArtworkIndexer = new AlbumArtworkIndexer(
            albumArtworkRemoverMock.object,
            albumArtworkAdderMock.object,
            snackBarServiceMock.object,
            loggerMock.object,
        );
    });

    describe('indexAlbumArtworkAsync', () => {
        it('should remove artwork that has no track', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkThatHasNoTrackAsync(), Times.exactly(1));
        });

        it('should remove artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(), Times.exactly(1));
        });

        it('should add artwork for tracks that need album artwork indexing', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkAdderMock.verify((x) => x.addAlbumArtworkForTracksThatNeedAlbumArtworkIndexingAsync(), Times.exactly(1));
        });

        it('should remove artwork that is not in the database from disk', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            albumArtworkRemoverMock.verify((x) => x.removeAlbumArtworkThatIsNotInTheDatabaseFromDiskAsync(), Times.exactly(1));
        });

        it('should dismiss the indexing notification with a short delay', async () => {
            // Arrange
            trackRepositoryMock.setup((x) => x.getAlbumDataThatNeedsIndexing()).returns(() => []);

            // Act
            await albumArtworkIndexer.indexAlbumArtworkAsync();

            // Assert
            snackBarServiceMock.verify((x) => x.dismissDelayedAsync(), Times.exactly(1));
        });
    });
});
