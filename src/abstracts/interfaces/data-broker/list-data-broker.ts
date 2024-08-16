import { CRUD, ID, PLAIN_OBJECT } from "../../types/common";
import { DataBroker } from "./data-broker";
import { Observable } from "rxjs";

export interface ListDataBrokerConfig extends PLAIN_OBJECT{ 
    perPage : number;
}

export interface ListDataBrokerResult<D> extends PLAIN_OBJECT{
    data : D;
};

export interface ListDataBrokerCRUDUpdate<D> extends PLAIN_OBJECT{
    crudType:CRUD,
    data : D;
};

export interface ListDataBrokerLoadOneOptions extends PLAIN_OBJECT{
    id:ID;
    checkCache?:boolean;
}

export interface ListDataBrokerLoadOptions extends PLAIN_OBJECT{
    page : number;
    perPage : number;
    checkCache?:boolean,
}

/**
 * An extension of the data broker interface that handles an array of data.
 * Can be used in CRUD features.
 * 
 * @param D the type of a single data
 * @param EV_Type the type of the output event the child side emits
 */
 export interface ListDataBroker< D, EV_Type> extends DataBroker<EV_Type>{

    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig() : Promise<ListDataBrokerConfig>;

    /**
     * @param options the options that can be used to load the data
     * @returns a single data
     */
    loadOne( options:ListDataBrokerLoadOneOptions ) : Promise<ListDataBrokerResult<D>>;

     /**
      * @param options the options that can be used to load the data
      * @returns an array of data
      */
    load( options:ListDataBrokerLoadOptions ) : Promise<ListDataBrokerResult<D[]>>;
     
     /**
      * @returns an observable that keeps emiting CRUD updates so the client side can hold consistent information
      */
    streamCRUDUpdates(): Observable<ListDataBrokerCRUDUpdate<D>>;

    /**
     * @returns a promise that resolves to true if pagination should be enabled in client side else it resolves to false
     */
    isPaginationEnabled(): Promise<boolean>;

    /**
     * @returns a promise that resolves to true if the ui list in client side is refreshable else it resolves to false
     */
    isRefreshEnabled(): Promise<boolean>;

    /**
     * Called to check if a CRUD action can be carried out
     * @param crudType the crud type
     * @returns a promise that resolves to true if the action can be carried out else it resolves to false
     */
    canCRUD( crudType:CRUD ): Promise<boolean>;

    /**
     * Called to emit a CRUD event
     * @param crudType the crud type
     * @param data the event data
     * 
     * @returns a promise that resolves if the event handling was successful else it rejects
     */
    onCRUD( crudType:CRUD , data?:D ):Promise<any>;
}