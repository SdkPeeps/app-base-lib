import { DATA_COMPARATOR, ID, PLAIN_OBJECT } from "../../types/common";
import { DataBroker, DataBrokerConfig } from "./data-broker";
import { Observable } from "rxjs";
import { CRUD } from "../../enums/common";

export interface ListDataBrokerConfig extends DataBrokerConfig{
    pagination:{
        perPage : number;
    }
}

export interface ListDataBrokerResult<D> extends PLAIN_OBJECT{
    data : D;
};

export interface ListDataBrokerUpdate<D> extends PLAIN_OBJECT{
    data : D;
};

export interface ListDataBrokerCRUDUpdate<D> extends ListDataBrokerUpdate<D>{
    crudType:CRUD
};

export interface ListDataBrokerLoadOptions0 extends PLAIN_OBJECT{
    checkCache?:boolean;
}

export interface ListDataBrokerLoadOneOptions extends ListDataBrokerLoadOptions0{
    id:ID;
}

export interface ListDataBrokerLoadOptions<S> extends ListDataBrokerLoadOptions0{
    search?:{
        constraint:S
    },
    page : number;
    perPage : number;
}

/**
 * An extension of the data broker interface that handles a list of data. Can be used in CRUD features.
 * 
 * @type U the type of a unnormalized data
 * @type D the type of a normalized data
 * @type S the type of the search constraint specified during loading
 * @type EV_Type the type of the output event the child side emits
 */
 export interface ListDataBroker<U,D,S, EV_Type> extends DataBroker<D[],EV_Type>{

    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig() : ListDataBrokerConfig;

    /**
     * @param options the options that can be used to load the single data from a cache or data source
     * @returns an object that contains the single data
     */
    loadOne( options:ListDataBrokerLoadOneOptions ) : Promise<ListDataBrokerResult<D>>;

    /**
     * This method can be used to keep track of the most recent copy of a single data. Hence if a data has been updated,
     * the child side can use this method to be notified by the parent side of the latest copy.
     * 
     * @param options the options that can be used to load the single data
     * @returns an observable that keeps emiting newer copies of the data
     */
    streamOne( options: ListDataBrokerLoadOneOptions ): Observable<ListDataBrokerUpdate<D>>;

    /**
     * @param options the options that can be used to load the array of data from a cache or data source
     * @returns an object that contains an array of data
     */
    load( options:ListDataBrokerLoadOptions<S> ) : Promise<ListDataBrokerResult<D[]>>;

    /**
     * @returns an observable that keeps emiting CRUD updates so the client side can hold consistent information
     */
    streamCRUDUpdates(): Observable<ListDataBrokerCRUDUpdate<D>>;

    /**
     * Called to check if a CRUD action can be carried out
     * @param crudType the crud type
     * @returns a promise that resolves to true if the action can be carried out else it resolves to false
     */
    canCRUD( crudType:CRUD ): Promise<boolean>;

    /**
     * Rather than call onCRUD() method directly to emit a CRUD event, call this method which will carry out some critical actions( e.g. actions for consistency and optimization ) and
     * in turn call onCRUD().
     * @param crudType the crud type
     * @param data the event data
     * 
     * @returns a promise that resolves if the event handling was successful else it rejects
     */
    emitCRUDEvent( crudType:CRUD , data?:U|D ):Promise<D>;

    modifyCache( crudType:CRUD.UPDATE|CRUD.DELETE , data:D ):void;

    /**
     * Called to emit a CRUD event. Do not call this method directly, call emitCRUDEvent() instead.
     * @param crudType the crud type
     * @param data the event data
     * 
     * @returns a promise that resolves if the event handling was successful else it rejects
     */
    onCRUD( crudType:CRUD , data?:U|D ):Promise<D>;

    /**
     * @returns a comparator that can be used for data comparison
     */
    getComparator():DATA_COMPARATOR<D>;
}
