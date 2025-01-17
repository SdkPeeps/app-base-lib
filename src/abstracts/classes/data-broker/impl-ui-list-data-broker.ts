import { Subject} from "rxjs";
import { CRUD } from "../../enums/common";
import { CREATE_OR_UPDATE_UI_FLOW_OPTIONS, DELETE_UI_FLOW_OPTIONS, UIDataBroker, 
    UIDataBrokerConfig as UIListDataBrokerConfig } from "../../interfaces/data-broker/ui-data-broker";
import { PAGINATION_OPTIONS, PLAIN_OBJECT, RESULT } from "../../types/common";
import { ACTION_SHEET_OPTIONS, ACTION_SHEET_RESULT, ALERT_DIALOG_OPTIONS, ALERT_DIALOG_RESULT, CONFIRM_DIALOG_OPTIONS, CONFIRM_DIALOG_RESULT, ListUIDataBrokerConfig, PROGRESS_DIALOG_OPTIONS, PROGRESS_DIALOG_RESULT, PROMPT_DIALOG_OPTIONS, PROMPT_DIALOG_RESULT, TOAST_OPTIONS, TOAST_RESULT } from "../../types/ui-commons";
import { ImplListDataBroker } from "./impl-list-data-broker";

/**
 * An abstract class that extends the ImplListDataBroker class and adds the following to the heavy lifting it does :
 * 
 * 1. Provides utility functions for CRUD UI execution flow management through IOC( inversion of control ). This can be used by client side of the
 * data broker to carry out crud operations by only providing data the flow needs as it executes.
 */
export abstract class ImplUIListDataBroker<U,D,S, EV_Type> extends ImplListDataBroker<U,D,S,EV_Type> implements UIDataBroker<U,D,S,EV_Type>{

    /**
     * @param paginationOptions The paginatedDataManager options
     * @param idPropName the property name in a data that is used to get the data id
     * @param fetchOneResultAsLatest Whether the result returned by fetchOne() should be regarded as the most recent copy of that data 
     * which can be used to keep the child side consistent and optimized in operation.
     */
    constructor( paginationOptions:PAGINATION_OPTIONS , idPropName:string , fetchOneResultAsLatest:boolean = true ){
        super(paginationOptions, idPropName, fetchOneResultAsLatest );
    }

    abstract showActionSheet(options: ACTION_SHEET_OPTIONS): ACTION_SHEET_RESULT ;
    abstract showAlertDialog(options: ALERT_DIALOG_OPTIONS): ALERT_DIALOG_RESULT;
    abstract showPromptDialog(options: PROMPT_DIALOG_OPTIONS): PROMPT_DIALOG_RESULT;
    abstract showConfirmDialog(options: CONFIRM_DIALOG_OPTIONS): CONFIRM_DIALOG_RESULT;

    /**
     * Used to show a toast message
     * @param options the toast options
     * @returns a promise that resolves to an object that contains a hide function which can be used to hide the toast 
     */
    abstract showToast(options: TOAST_OPTIONS):TOAST_RESULT;

    /**
     * Used to show a progress dialog
     * @param options the progress options
     * @returns a promise resolves to an object that contains a hide function which can be used to hide the progress and a progressSubject
     * which when provided will run in deterministic mode and updates the progress to any number emited from the subject( an observable ).
     */
    abstract showProgressDialog(options: PROGRESS_DIALOG_OPTIONS): PROGRESS_DIALOG_RESULT;

    /**
     * Will run a CRUD UI execution flow when called and allows IOC as it executes.
     * 
     * @param crudType The type of CRUD operation
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    private async runCRUDUIFlow(crudType:CRUD.CREATE|CRUD.UPDATE|CRUD.DELETE,options:CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D>|DELETE_UI_FLOW_OPTIONS<D>): Promise<void> {

        // The data gotten as input from UI, which means it might be unnormalized.
        let data:U|D;

        if( crudType == CRUD.CREATE||crudType == CRUD.UPDATE ){

            const input = (options as CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D>).input;

            let newUnnormalizedDataResult:RESULT<U|D,any>;

            try{

                // get the data from UI, possibly unnormalized
                newUnnormalizedDataResult = await input.get();

                if( !newUnnormalizedDataResult || newUnnormalizedDataResult.reason == 'close' ){
                    return;
                }
                else if( newUnnormalizedDataResult.reason == 'failure' ){
                    throw newUnnormalizedDataResult.err;
                }

                data = newUnnormalizedDataResult.data;
            }
            catch( e ){
                
                const failureMsg = input.messages?.failure;
                if(failureMsg) this.showToast({
                    message:failureMsg
                });
                return Promise.reject(e);
            }
        }
        else{

            const _options = options as DELETE_UI_FLOW_OPTIONS<D>;

            if( _options.crudEvent.before.confirm?.dialog ){
                const confirmDialogResult = await this.showConfirmDialog( {
                    title: _options.crudEvent.before.confirm.dialog.title,
                    message: _options.crudEvent.before.confirm.dialog.message,
                } );
                
                const {yes} = await confirmDialogResult.onEnd;

                if(!yes) return;
            }

            data = _options.data;
        }

        if( typeof options.crudEvent.before?.callback === 'function' ) await options.crudEvent.before?.callback();

        const progressResult = options.crudEvent.before?.progress ? await this.showProgressDialog( options.crudEvent.before?.progress ) : null;

        try{

            // normalized data is returned
            const normalizedData = await this.emitCRUDEvent( crudType , data );

            if( progressResult ) await progressResult.hide();

            const successMsg = options.crudEvent.after.messages?.success;
            if(successMsg) this.showToast({
                message:successMsg,
            });

            // update the data held by the paginatedDataManager
            this.reflectDataIntoPaginatedDataManager( crudType , normalizedData );
            
            const subject = options.crudEvent.after.subject;
            
            subject.next( normalizedData );
            subject.complete();
        }
        catch( e ){
            return (progressResult ? progressResult.hide() : Promise.resolve()).then(()=>{
                    
                const failureMsg = options.crudEvent.after.messages?.failure;
                if(failureMsg) this.showToast({
                    message:failureMsg,
                });

                const subject = options.crudEvent.after.subject;
                subject.error( e );   

                Promise.reject(e);
            });
        }
    }

    /**
     * Will run a Create UI execution flow when called and allows IOC as it executes.
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    async runCreateUIFlow(options:CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D>): Promise<void> {
        return this.runCRUDUIFlow( CRUD.CREATE, options );
    }

    /**
     * Will run a Update UI execution flow when called and allows IOC as it executes.
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    async runUpdateUIFlow(options:CREATE_OR_UPDATE_UI_FLOW_OPTIONS<U,D>): Promise<void> {
        return this.runCRUDUIFlow( CRUD.UPDATE, options );
    }

    /**
     * Will run a Delete UI execution flow when called and allows IOC as it executes.
     * @param options the options that contain data used during execution and callback functions for IOC.
     */
    async runDeleteUIFlow(options: DELETE_UI_FLOW_OPTIONS<D>): Promise<void> {
        return this.runCRUDUIFlow( CRUD.DELETE, options );
    }
    
    // CHECK PARENT INTERFACE FOR DOCUMENTATION
    abstract getConfig(): ListUIDataBrokerConfig;
    //
}
