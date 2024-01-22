import { ComponentsComponent } from './components.component';
import { ExternalComponent } from '../../../../common/application/external-component';
import { IMock, Mock, Times } from 'typemoq';
import { DesktopBase } from '../../../../common/io/desktop.base';

describe('ComponentsComponent', () => {
    let desktopMock: IMock<DesktopBase>;
    let component: ComponentsComponent;

    beforeEach(() => {
        desktopMock = Mock.ofType<DesktopBase>();
        component = new ComponentsComponent(desktopMock.object);
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act

            // Assert
            expect(component).toBeDefined();
        });
    });

    describe('externalComponents', () => {
        it('should return a list of external components', () => {
            // Arrange

            // Act
            const externalComponents: ExternalComponent[] = component.externalComponents;

            // Assert
            expect(externalComponents.length).toBeGreaterThan(0);
        });
    });

    describe('browseToUrlAsync', () => {
        it('should browse to given url', async () => {
            // Arrange

            // Act
            await component.browseToUrlAsync('myUrl');

            // Assert
            desktopMock.verify((desktop) => desktop.openLinkAsync('myUrl'), Times.once());
        });
    });
});
