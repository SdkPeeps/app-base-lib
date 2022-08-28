
export type ACTION = { type:'do'|'undo' };

import {Subject,Observable} from 'rxjs';

export class IdempotentDoAndUndoActionHelper{

    private count = 0;

    private readonly actionSubject:Subject<ACTION> = new Subject<ACTION>();
    public readonly actionObservable:Observable<ACTION>;

    public do(){
        this.count++;
        if( this.count == 1 ) this.actionSubject.next({ type:'do' });
    }

    public undo(){
        if( this.count < 1 ) throw new Error('this undo call does not have a corresponding previous do call');
        this.count--;
        if( this.count == 0 ) this.actionSubject.next({ type:'undo' });
    }

    public getCount(){
        return this.count;
    }
}
