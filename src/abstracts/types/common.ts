import { DataBrokerConfig } from "../interfaces/data-broker/data-broker";

export type ID = number|string;

export type PLAIN_OBJECT<D=any> = {[index:string]:D}

export type RESULT<D,ERR> = PLAIN_OBJECT & {
    data:D,
    err?:ERR,
    reason:'close'|'success'|'failure',
};

export type DATA_COMPARATOR<T> = ( data1:T , data2:T ) => -1|0|1;

export type AppDataBrokerThirdPartyAPIConfig = {
    url?:string,
    key:string
};

export type AppDataBrokerConfig = DataBrokerConfig & {
    thirdParty?:{
        api?:{
            [apiName:string] : AppDataBrokerThirdPartyAPIConfig
        },
    },
};

export type PAGINATION_OPTIONS = {perPage:number,append?:boolean} ;

export type SEARCH_FUNCTION<D,SC> = ( searchConstraint:SC ) => Promise<D>;
