import { IMock, Mock } from 'typemoq';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { SettingsBase } from '../../../../common/settings/settings.base';
import { LogViewer } from '../../../../common/io/log-viewer';

describe('AdvancedSettingsComponent', () => {
    let settingsMock: IMock<SettingsBase>;
    let logViewerMock: IMock<LogViewer>;

    beforeEach(() => {
        settingsMock = Mock.ofType<SettingsBase>();
        logViewerMock = Mock.ofType<LogViewer>();
    });

    function createComponent(): AdvancedSettingsComponent {
        return new AdvancedSettingsComponent(settingsMock.object, logViewerMock.object);
    }

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: AdvancedSettingsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });

        it('should define settings', () => {
            // Arrange

            // Act
            const component: AdvancedSettingsComponent = createComponent();

            // Assert
            expect(component.settings).toBeDefined();
        });
    });

    describe('constructor', () => {
        it('should create', () => {
            // Arrange

            // Act
            const component: AdvancedSettingsComponent = createComponent();

            // Assert
            expect(component).toBeDefined();
        });
    });
});
