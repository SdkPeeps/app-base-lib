
export interface DataBrokerEvent<T>{
    [index:string] : any;
    type:T;
}

export interface DataBrokerConfig{ 
    [index:string] : any;
    perPage : number;
}

/**
 * An interface that allows a parent and child side to communicate in an efficient way, adhereing to principles in SOLID design patterns.
 */
export interface DataBroker<EV_Type>{
    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig() : Promise<DataBrokerConfig>;
    
    /**
     * Called to emit an event
     * @param ev the event data
     */
    on(ev : DataBrokerEvent<EV_Type>);
}
