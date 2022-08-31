import { PLAIN_OBJECT, RESULT } from "../../types/common";
import { DataBroker, DataBrokerConfig } from "./data-broker";
import { Subject } from "rxjs";
import { ListDataBrokerLoadOneOptions, ListDataBrokerLoadOptions, ListDataBrokerResult } from "./list-data-broker";
import { UI_MESSAGE_VALUES, TOAST_OPTIONS, PROGRESS_DIALOG_OPTIONS, BASE_DIALOG_RESULT, ALERT_DIALOG_OPTIONS, PROMPT_DIALOG_OPTIONS, CONFIRM_DIALOG_OPTIONS, CONFIRM_DIALOG_RESULT, PROMPT_DIALOG_RESULT, ALERT_DIALOG_RESULT, PROGRESS_DIALOG_RESULT, ACTION_SHEET_OPTIONS, ACTION_SHEET_RESULT, TOAST_RESULT } from "../../types/ui-commons";
import { CRUD } from "../../enums/common";

export type UIDataBrokerConfig = DataBrokerConfig & { 
    ui:{
        general:{
            pagination:{
                enabled:boolean
            },
            swipeRefresh:{
                enabled:boolean
            }
        }
    }
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
            confirm?:{
                dialog?:{
                    title:string,
                    message:string
                }
            },
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
 * @type U the type of a unnormalized data
 * @type D the type of a single data
 * @type S the type of the search constraint specified during loading
 * @type EV_Type the type of the output event the child side emits
 */
export interface UIDataBroker< U,D,S, EV_Type> extends DataBroker<D[],EV_Type>{

    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig() : UIDataBrokerConfig;

    /**
     * Used to show a toast message
     * @param options the toast options
     * @returns a promise resolves to an object that contains a hide function which can be used to hide the toast 
     */
    showToast( options:TOAST_OPTIONS ):TOAST_RESULT;

    /**
     * Used to show a progress dialog
     * @param options the progress options
     * @returns a promise resolves to an object that contains a hide function which can be used to hide the progress and a progressSubject
     * which when provided will run in deterministic mode and updates the progress to any number emited from the subject( an observable ).
     */
    showProgressDialog( options:PROGRESS_DIALOG_OPTIONS ):PROGRESS_DIALOG_RESULT;

    showAlertDialog( options:ALERT_DIALOG_OPTIONS ):ALERT_DIALOG_RESULT;
    showPromptDialog( options:PROMPT_DIALOG_OPTIONS ):PROMPT_DIALOG_RESULT;
    showConfirmDialog( options:CONFIRM_DIALOG_OPTIONS ):CONFIRM_DIALOG_RESULT;
    showActionSheet( options:ACTION_SHEET_OPTIONS ) : ACTION_SHEET_RESULT;
    
    /**
     * A core method that is not limited to the data handled by any instance of this databroker. It will run a CRUD UI execution flow when called and allows IOC as it executes.
     * 
     * @param crudType The type of CRUD operation
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    runCRUDUIFlow<U0=U,D0=D>(crudType:CRUD.CREATE|CRUD.UPDATE|CRUD.DELETE,options:(CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U0,D0>|DELETE_UI_FLOW_OPTIONS<D0>)&{
        crudEventEmitter:( crudType:CRUD, data:U0 | D0 ) => Promise<D0>
    }): Promise<void>;

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
    fetch(options: ListDataBrokerLoadOptions<S>): Promise<ListDataBrokerResult<D[]>>;
}
