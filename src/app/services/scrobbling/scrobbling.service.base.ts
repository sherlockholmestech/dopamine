import { Observable } from 'rxjs';
import { TrackModel } from '../track/track-model';
import { SignInState } from './sign-in-state';

export abstract class ScrobblingServiceBase {
    public abstract signInStateChanged$: Observable<SignInState>;
    public abstract get signInState(): SignInState;
    public abstract username: string;
    public abstract password: string;
    public abstract initialize(): void;
    public abstract signInAsync(): Promise<void>;
    public abstract signOut(): void;
    public abstract sendTrackLoveAsync(track: TrackModel, love: boolean): Promise<void>;
}
