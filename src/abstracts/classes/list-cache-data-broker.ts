
import { concat, EMPTY, from, map, Observable, of, switchMap } from "rxjs";
import { DataBrokerEvent } from "../interfaces/data-broker/data-broker";
import { ListDataBroker, ListDataBrokerConfig, ListDataBrokerCRUDUpdate, ListDataBrokerLoadOneOptions, ListDataBrokerLoadOptions, 
    ListDataBrokerResult } from "../interfaces/data-broker/list-data-broker";
import { CRUD } from "../types/common";

/**
 * @todo The caching feature still needs to be improved. Only loadOne() does caching for now and uses an unordered list. 
 * The paginated-data-manager needs to be improved to support managing data for an arbitrary page.
 */
export abstract class ListCacheDataBroker<D,EV_type> implements ListDataBroker<D,EV_type>{

    /**
     * @todo should be removed when paginated-data-manager is introduced
     */
    private unorderedCache:D[] = [];

    constructor( private idKey = 'id' ){
    }

    public streamOne( options: ListDataBrokerLoadOneOptions ): Observable<D> {

        const id = options.id;

        const data$ = from(this.loadOne( options )).pipe( map( result => result.data ) );

        return concat( data$ , this.streamCRUDUpdates().pipe( switchMap( update => {
            if( update.crudType == CRUD.UPDATE && update.data[this.idKey] == id ){
                return of( update.data );
            }
            return EMPTY;
        } ) ) );
    }

    /**
     * @implements check parent interface for documentation
     */
    async loadOne(options: ListDataBrokerLoadOneOptions): Promise<ListDataBrokerResult<D>> {

        if(!options.checkCache){

            const data = this.unorderedCache.find( datium => datium[this.idKey] == options.id );

            if( data ) return { data };
        }

        return this.fetchOne( options );
    }

    /**
     * @implements check parent interface for documentation
     */
    async load( options : ListDataBrokerLoadOptions ): Promise<ListDataBrokerResult<D[]>> {

        const result = await this.fetch( options );

        const dataResult = result.data;

        const cache = this.unorderedCache;

        // remove old data
        const filteredCache = cache.filter( datium => dataResult.findIndex( d => d[this.idKey] == datium[this.idKey] ) < 0 );

        // push the new data
        filteredCache.push( ...dataResult );

        this.unorderedCache = cache;

        return result;
    }

    // CHECK THE PARENT FILE FOR DOCUMENTATION
    abstract getConfig(): Promise<ListDataBrokerConfig>;
    abstract streamCRUDUpdates(): Observable<ListDataBrokerCRUDUpdate<D>>;
    abstract isPaginationEnabled(): Promise<boolean>;
    abstract isRefreshEnabled(): Promise<boolean>;
    abstract canCRUD(crudType: CRUD): Promise<boolean>;
    abstract onCRUD(crudType: CRUD, data?: D): Promise<any>;
    abstract on(ev: DataBrokerEvent<EV_type>): Promise<any> ;
    //

    /**
     * @param options the options that can be used to fetch the data
     * @returns a single data
     */
    abstract fetchOne(options: ListDataBrokerLoadOneOptions): Promise<ListDataBrokerResult<D>>;
    
    /**
     * @param options the options that can be used to fetch the data
     * @returns an array of data
     */
    abstract fetch(options: ListDataBrokerLoadOptions): Promise<ListDataBrokerResult<D[]>>;
}