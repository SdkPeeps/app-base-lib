import { CRUD, ID } from "../types/common";
export interface DataBrokerConfig {
    [index: string]: any;
    perPage: number;
}
export interface ListDataBrokerResult<D> {
    [index: string]: any;
    data: D;
}
export interface ListDataBrokerLoadOneOptions {
    [index: string]: any;
}
export interface ListDataBrokerLoadOptions extends ListDataBrokerLoadOneOptions {
    page: number;
    perPage: number;
}
export interface ListDataBrokerEvent<T> {
    [index: string]: any;
    type: T;
}
/**
 * An interface that allows a parent and child side to communicate in an efficient way, adhereing to principles in SOLID design patterns.
 */
export interface DataBroker {
    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig(): Promise<DataBrokerConfig>;
}
/**
 * An extension of the data broker interface that handles an array of data.
 * Can be used in CRUD features.
 */
export interface ListDataBroker<D, EV_Type> extends DataBroker {
    /**
     * @param options the options that can be used to load the data
     * @returns fetches a data with an id
     */
    loadOne(id: ID, options: ListDataBrokerLoadOneOptions): Promise<ListDataBrokerResult<D>>;
    /**
     * @param options the options that can be used to load the data
     * @returns an array of data
     */
    load(options: ListDataBrokerLoadOptions): Promise<ListDataBrokerResult<D[]>>;
    /**
     * Called to check if a action can be carried out
     * @param crudType the crud type
     * @returns a promise that resolves to true if the action can be carried out else it resolves to false
     */
    canCRUD(crudType: CRUD): Promise<boolean>;
    /**
     * Called to emit an event
     * @param crudType the crud type
     * @param ev the event data
     */
    on(ev: ListDataBrokerEvent<EV_Type>): any;
    /**
     * Called to emit a CRUD event
     * @param crudType the crud type
     * @param data the event data
     */
    onCRUD(crudType: CRUD, data?: D): any;
}
