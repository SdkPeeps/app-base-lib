import { Subject } from "rxjs";
import { CRUD } from "../enums/common";
import { ListDataBrokerConfig } from "../interfaces/data-broker/list-data-broker";
import { UIDataBrokerConfig } from "../interfaces/data-broker/ui-data-broker";
import { ID, PLAIN_OBJECT } from "./common";

export type EDITOR_CRUD_MODE = CRUD.CREATE | CRUD.UPDATE;

export type ListUIDataBrokerConfig = UIDataBrokerConfig & ListDataBrokerConfig;


export type TOAST_POSITION =  'top' | 'bottom' | 'middle';

export type TOAST_OPTIONS = {
    message: string,
    duration?:number,
    position?:TOAST_POSITION,
    btnText?:string
};

export type DIALOG_OPTIONS = {
    title:string,
    message:string
};

/**
 * @todo should accept multiple inputs with various input type
 */
export type PROMPT_DIALOG_OPTIONS = DIALOG_OPTIONS & {
    dom:{
        input:{
            name:string,
            placeholder:string
        }
    },
    buttons?:{
        ok?:{
            label?:string,
        }
    }
};

export type ALERT_DIALOG_OPTIONS = DIALOG_OPTIONS & {
    buttons?:{
        ok?:{
            label?:string,
        }
    }
};

export type CONFIRM_DIALOG_OPTIONS = DIALOG_OPTIONS & {
    buttons?:{
        yes?:{
            label?:string,
        },
        no?:{
            label?:string,
        }
    }
};

export type PROGRESS_DIALOG_OPTIONS = DIALOG_OPTIONS & {
};

export type ACTION_SHEET_BUTTON_ROLE = 'default' | 'create' | 'update' | 'read' | 'delete' | 'cancel' | 'proceed' ;
export type ACTION_SHEET_OPTIONS = {
    title:string,
    buttons:{
        id:ID,
        role?:ACTION_SHEET_BUTTON_ROLE,
        label:string
    }[]
};

export type BASE_DIALOG_RESULT<R=void> = { hide:()=>Promise<void> , onEnd:Promise<R> };

export type TOAST_RESULT = Promise<BASE_DIALOG_RESULT>;
export type PROGRESS_DIALOG_RESULT = Promise<BASE_DIALOG_RESULT&{ progressSubject?:Subject<number>}>;
export type ALERT_DIALOG_RESULT = Promise<BASE_DIALOG_RESULT>;
export type PROMPT_DIALOG_RESULT = Promise<BASE_DIALOG_RESULT<{data:PLAIN_OBJECT<string>}>>;
export type CONFIRM_DIALOG_RESULT = Promise<BASE_DIALOG_RESULT<{yes:boolean}>>;

export type ACTION_SHEET_RESULT = Promise<BASE_DIALOG_RESULT<{id:ID}>>;

export type UI_MESSAGE_VALUES = {
    [key:string] : any,
    success?:string,
    failure?:string
};

export type PROGRESS_DIALOG_FUNCTION = ( options:PROGRESS_DIALOG_OPTIONS ) => PROGRESS_DIALOG_RESULT;
export type ALERT_DIALOG_FUNCTION = ( options:ALERT_DIALOG_OPTIONS ) => ALERT_DIALOG_RESULT;
export type CONFIRM_DIALOG_FUNCTION = ( options:CONFIRM_DIALOG_OPTIONS ) => CONFIRM_DIALOG_RESULT;
export type PROMPT_DIALOG_FUNCTION = ( options:PROMPT_DIALOG_OPTIONS ) => PROMPT_DIALOG_RESULT;

export type ACTION_SHEET_FUNCTION = ( options:ACTION_SHEET_OPTIONS ) => ACTION_SHEET_RESULT;
export type TOAST_FUNCTION = ( options:TOAST_OPTIONS ) => TOAST_RESULT;
