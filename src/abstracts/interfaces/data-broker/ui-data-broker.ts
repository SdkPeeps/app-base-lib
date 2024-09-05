import { RESULT } from "../../types/common";
import { DataBroker } from "./data-broker";
import { Subject } from "rxjs";
import { ListDataBrokerConfig, ListDataBrokerLoadOneOptions, ListDataBrokerLoadOptions, ListDataBrokerResult } from "./list-data-broker";

export type TOAST_POSITION =  'top' | 'bottom' | 'middle';

export type TOAST_OPTIONS = {
    message: string,
};

export type PROGRESS_DIALOG_OPTIONS = {
    title:string,
    message:string
};

export type UI_MESSAGE_VALUES = {
    [key:string] : any,
    success?:string,
    failure?:string,
};

export type UIDataBrokerConfig = ListDataBrokerConfig & { 
};

export type CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D> = {
    input:{
        get():Promise<RESULT<U|D,any>>,
        messages?:{
            failure?:string,
        },
    },
    crudEvent:{
        before:{
            progress?:{
                title:string,
                message:string,
            },
            callback?:()=>Promise<void>,
        },
        after:{
            subject:Subject<D>,
            messages?:UI_MESSAGE_VALUES,
        },
    },
};

export type DELETE_UI_FLOW_OPTIONS<D> = {
    data:D,
    crudEvent:{
        before:{
            progress?:{
                title:string,
                message:string,
            },
            callback?:()=>Promise<void>,
        },
        after:{
            subject:Subject<D>,
            messages?:UI_MESSAGE_VALUES,
        },
    },
};

/**
 * An extension of the data broker interface that handles a list of data.
 * Can be used in CRUD features.
 * 
 * @param D the type of a single data
 * @param EV_Type the type of the output event the child side emits
 */
export interface UIDataBroker< U,D, EV_Type> extends DataBroker<D[],EV_Type>{

    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig() : UIDataBrokerConfig;

    /**
     * @returns a promise that resolves to true if UI pagination should be enabled in client side else it resolves to false
    */
    isPaginationEnabled(): Promise<boolean>;

    /**
     * @returns a promise that resolves to true if the UI list in client side is refreshable else it resolves to false
     */
    isRefreshEnabled(): Promise<boolean>;
 
    /**
     * Used to show a toast message
     * @param options the toast options
     * @returns a promise resolves to an object that contains a hide function which can be used to hide the toast 
     */
    showToast( options:TOAST_OPTIONS ):Promise<{hide:()=>Promise<void>}>;

    /**
     * Used to show a progress dialog
     * @param options the progress options
     * @returns a promise resolves to an object that contains a hide function which can be used to hide the progress and a progressSubject
     * which when provided will run in deterministic mode and updates the progress to any number emited from the subject( an observable ).
     */
    showProgressDialog( options:PROGRESS_DIALOG_OPTIONS ):Promise<{ progressSubject?:Subject<number> , hide:()=>Promise<void>}>;

    /**
     * Will run a Create UI execution flow when called and allows IOC as it executes.
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    runCreateUIFlow( options:CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D> ) : Promise<void>;

    /**
     * Will run a Update UI execution flow when called and allows IOC as it executes.
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    runUpdateUIFlow( options:CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D> ) : Promise<void>;
    
    /**
     * Will run a Delete UI execution flow when called and allows IOC as it executes.
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    runDeleteUIFlow( options:DELETE_UI_FLOW_OPTIONS<D> ) : Promise<void>; 
    
    /**
     * @param options the options that can be used to fetch the data from a data source
     * @returns an object that contains the data
     */
    fetchOne(options: ListDataBrokerLoadOneOptions): Promise<ListDataBrokerResult<D>>;

    /**
     * @param options the options that can be used to fetch the data from a data source
     * @returns an object that contains the array of data
     */
    fetch(options: ListDataBrokerLoadOptions): Promise<ListDataBrokerResult<D[]>>;
}
