import { IMock, Mock } from 'typemoq';
import { Logger } from '../../../../common/logger';
import { AlbumOrder } from '../album-order';
import { GenresAlbumsPersister } from './genres-albums-persister';
import { TranslatorServiceBase } from '../../../../services/translator/translator.service.base';
import { FileAccess } from '../../../../common/io/file-access';
import { AlbumData } from '../../../../data/entities/album-data';
import { AlbumModel } from '../../../../services/album/album-model';

describe('GenresPersister', () => {
    let settingsStub: any;
    let loggerMock: IMock<Logger>;
    let translatorServiceMock: IMock<TranslatorServiceBase>;
    let fileAccessMock: IMock<FileAccess>;

    let persister: GenresAlbumsPersister;

    let albumData1: AlbumData;
    let albumData2: AlbumData;
    let albumData3: AlbumData;
    let album1: AlbumModel;
    let album2: AlbumModel;
    let album3: AlbumModel;
    let availableAlbums: AlbumModel[];

    beforeEach(() => {
        settingsStub = { genresTabSelectedAlbum: '', genresTabSelectedAlbumOrder: '' };
        loggerMock = Mock.ofType<Logger>();
        fileAccessMock = Mock.ofType<FileAccess>();
        translatorServiceMock = Mock.ofType<TranslatorServiceBase>();

        albumData1 = new AlbumData();
        albumData1.albumKey = 'albumKey1';
        albumData2 = new AlbumData();
        albumData2.albumKey = 'albumKey2';
        albumData3 = new AlbumData();
        albumData3.albumKey = 'albumKey3';
        album1 = new AlbumModel(albumData1, translatorServiceMock.object, fileAccessMock.object);
        album2 = new AlbumModel(albumData2, translatorServiceMock.object, fileAccessMock.object);
        album3 = new AlbumModel(albumData3, translatorServiceMock.object, fileAccessMock.object);
        availableAlbums = [album1, album2, album3];

        persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(persister).toBeDefined();
        });

        it('should initialize from the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbum = 'albumKey1';
            settingsStub.genresTabSelectedAlbumOrder = 'byYearDescending';
            persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);

            // Act

            // Assert
            expect(persister.getSelectedAlbums(availableAlbums).length).toEqual(1);
            expect(persister.getSelectedAlbums(availableAlbums)[0]).toBe(album1);
            expect(persister.getSelectedAlbumOrder()).toEqual(AlbumOrder.byYearDescending);
        });
    });

    describe('getSelectedAlbumFromSettings', () => {
        it('should get the selected album from the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbum = 'someAlbumKey';
            persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumFromSettings: string = persister.getSelectedAlbumFromSettings();

            // Assert
            expect(selectedAlbumFromSettings).toEqual('someAlbumKey');
        });
    });

    describe('saveSelectedAlbumToSettings', () => {
        it('should save the selected album to the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbum = '';
            persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);

            // Act
            persister.saveSelectedAlbumToSettings('someAlbumKey');

            // Assert
            expect(settingsStub.genresTabSelectedAlbum).toEqual('someAlbumKey');
        });
    });

    describe('getSelectedAlbumOrderFromSettings', () => {
        it('should get the selected album order from the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbumOrder = 'byYearDescending';
            persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumOrderFromSettings: string = persister.getSelectedAlbumOrderFromSettings();

            // Assert
            expect(selectedAlbumOrderFromSettings).toEqual('byYearDescending');
        });
    });

    describe('saveSelectedAlbumOrderToSettings', () => {
        it('should save the selected album to the settings', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbumOrder = '';
            persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);

            // Act
            persister.saveSelectedAlbumOrderToSettings('byYearDescending');

            // Assert
            expect(settingsStub.genresTabSelectedAlbumOrder).toEqual('byYearDescending');
        });
    });

    describe('getSelectedAlbums', () => {
        it('should return an empty collection given that availableAlbums is empty', () => {
            // Arrange

            // Act
            const selectedAlbums: AlbumModel[] = persister.getSelectedAlbums([]);

            // Assert
            expect(selectedAlbums.length).toEqual(0);
        });

        it('should return the selected album given valid availableAlbums', () => {
            // Arrange
            persister.setSelectedAlbums([album1, album2]);

            // Act
            const selectedAlbums: AlbumModel[] = persister.getSelectedAlbums(availableAlbums);

            // Assert
            expect(selectedAlbums.length).toEqual(2);
            expect(selectedAlbums[0]).toBe(album1);
            expect(selectedAlbums[1]).toBe(album2);
        });
    });

    describe('setSelectedAlbums', () => {
        it('should empty the selected albums if selectedAlbums is empty', () => {
            // Arrange

            // Act
            persister.setSelectedAlbums([]);

            // Assert
            expect(persister.getSelectedAlbums(availableAlbums)).toEqual([]);
        });

        it('should set the selected albums if selectedAlbums is valid', () => {
            // Arrange

            // Act
            persister.setSelectedAlbums([album2, album3]);

            // Assert
            expect(persister.getSelectedAlbums(availableAlbums)).toEqual([album2, album3]);
        });

        it('should save an empty selected album to the settings if selectedAlbums is empty', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbum = 'someAlbum';

            // Act
            persister.setSelectedAlbums([]);

            // Assert
            expect(settingsStub.genresTabSelectedAlbum).toEqual('');
        });

        it('should save the first selected album to the settings if selectedAlbums is valid', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbum = 'someAlbum';

            // Act
            persister.setSelectedAlbums([album2, album3]);

            // Assert
            expect(settingsStub.genresTabSelectedAlbum).toEqual('albumKey2');
        });
    });

    describe('getSelectedAlbumOrder', () => {
        it('should return byAlbumTitleAscending if there is no selected album order', () => {
            // Arrange

            // Act
            const selectedAlbumorder: AlbumOrder = persister.getSelectedAlbumOrder();

            // Assert
            expect(selectedAlbumorder).toEqual(AlbumOrder.byAlbumTitleAscending);
        });

        it('should return the selected album order if there is a selected album order', () => {
            // Arrange
            settingsStub.genresTabSelectedAlbumOrder = 'byYearDescending';
            persister = new GenresAlbumsPersister(settingsStub, loggerMock.object);

            // Act
            const selectedAlbumorder: AlbumOrder = persister.getSelectedAlbumOrder();

            // Assert
            expect(selectedAlbumorder).toEqual(AlbumOrder.byYearDescending);
        });
    });

    describe('resetSelectedAlbums', () => {
        it('should reset the selected albums', () => {
            // Arrange
            persister.setSelectedAlbums([album1, album2]);

            const previouslySelectedAlbums: AlbumModel[] = persister.getSelectedAlbums(availableAlbums);
            const previousGenresTabSelectedAlbum: string = settingsStub.genresTabSelectedAlbum;

            // Act
            persister.resetSelectedAlbums();
            const newlySelectedAlbums: AlbumModel[] = persister.getSelectedAlbums(availableAlbums);
            const newGenresTabSelectedAlbum: string = settingsStub.genresTabSelectedAlbum;

            // Assert
            expect(previouslySelectedAlbums.length).toEqual(2);
            expect(previouslySelectedAlbums[0]).toEqual(album1);
            expect(previouslySelectedAlbums[1]).toEqual(album2);
            expect(previousGenresTabSelectedAlbum).toEqual('albumKey1');

            expect(newlySelectedAlbums.length).toEqual(0);
            expect(newGenresTabSelectedAlbum).toEqual('');
        });
    });

    describe('setSelectedAlbumOrder', () => {
        it('should set the selected album order', () => {
            // Arrange

            // Act
            persister.setSelectedAlbumOrder(AlbumOrder.byYearDescending);

            // Assert
            expect(persister.getSelectedAlbumOrder()).toEqual(AlbumOrder.byYearDescending);
        });

        it('should save the selected album order to the settings', () => {
            // Arrange

            // Act
            persister.setSelectedAlbumOrder(AlbumOrder.byYearDescending);

            // Assert
            expect(settingsStub.genresTabSelectedAlbumOrder).toEqual('byYearDescending');
        });
    });
});
