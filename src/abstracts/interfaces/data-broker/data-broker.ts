
export interface DataBrokerConfig{ 
}

export interface DataBrokerEvent<T>{
    [index:string] : any;
    type:T;
}

/**
 * A dataBroker is an object that allows a parent and child side to communicate through an interface, adhereing to principles in SOLID design patterns.
 * 
 * The child side askes the parent for data and emits event to the parent side. This can be viewed in a family setting where a relationship exists between parents and 
 * their children. Parents gives their children what they want and observes them to watch their wellbeing. Hence the parent is serving the child. The databroker is based on
 * this kind of relationship.
 * 
 * For performance sake the parent side might choose to cache a data the child side askes for.
 * 
 * @type D the type of data the child side expects
 * @type EV_Type the type of the output event the child side emits
 */
export interface DataBroker<D,EV_Type>{

    /**
     * Called by child side to get the data from the parent side
     * @returns a promise that resolves to the data needed
     */
    getData():Promise<D>;

    /**
     * @returns a configuration that the child side of the data broker can use
     */
    getConfig() : DataBrokerConfig;
    
    /**
     * Called from child side to emit an event
     * @param ev the event data
     * @returns a promise that resolves if the event handling was successful else it rejects
     */
    on(ev : DataBrokerEvent<EV_Type>):Promise<any>;
}
