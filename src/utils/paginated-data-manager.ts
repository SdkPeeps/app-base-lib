import { Subject } from "rxjs";
import { DATA_COMPARATOR } from "../abstracts/types/common";
import { ObjectUtils, OBJ_MODIFY_APPROACH } from "./object-utils";

/**
 * A class that can be used to manage pagination for a growing list of data. A list based UI can use it to perform infinite scroll.
 * 
 * It expects data to be added in batches which basically is how pagination works for a growing list.
 * 
 * @todo it should be able to receive not only the next batch of data, but an arbitrary batch of data. This will help in features
 * where by a big list of data is searched for data that matches a criteria, and the user has to be taken to where the matching data exists 
 * in the scroll view, which possibly makes the batches not consecutive in order and possibly farther from each other. 
 * Whatsapp has this feature which manifests when one searches the message thread.
 */
export class PaginatedDataManager<D>{

    // used to emit all batches of data gotten when there is a change
    private readonly dataChangeSubject = new Subject<D[]>();

    // can be used to observe change in data
    public readonly dataChangeObservable = this.dataChangeSubject.asObservable();

    /**
     * An array of data which comes in batches
     */
    private _data:D[] = [];

    set data( data:D[] ){
        this._data = data;
        this.dataChangeSubject.next(data);
    }

    get data(){
        return this._data;
    }

    /**
     * The number of data that a batch contains
     */
    private perPage:number;

    /**
     * The current page that indicates the number of batches that have been fetched
     */
    private page:number = 0;

    /**
     * Used to decide whether new batch of data should be appended or prepended
     */
    private append:boolean;

    /**
     * Can be used to know the next batch of data to fetch
     */
    public get nextPage(){
        return this.isBatchCountAbsolute() ? this.page + 1 : this.page;
    }

    constructor( perPage:number , append:boolean = true ){
        this.perPage = perPage;
        this.append = append;
    }

    /**
     * @param page the page of the batch
     * @returns true if the batch exists else false
     */
    public batchExists( page:number ):boolean{
        return this.isBatchCountAbsolute() ? page < this.nextPage : page <= this.nextPage;
    }

    /**
     * @param page the page of the batch to fetch
     * @returns a batch of data
     */
    public getBatch( page:number ):D[]{

        if( page < 1 ){
            throw new Error(` page( ${page} ) should not be less than 1 `);
        }

        if( !this.batchExists(page) ){
            throw new Error(` invalid page( ${page} ), the batch asked does not exist `);
        }

        return this.data.slice( ( page - 1 ) * this.perPage , page * this.perPage );
    }

    /**
     * adds a data to the list of data. The data will be added to the opposite end of where the next batch will be added.
     * 
     * @example Consider a list UI which uses this class to manage its data. When a new data is created( maybe a user input ), it should be saved somewhere 
     * (e.g. posted to server ) and if successfully saved. With this method, it is then added to all batches of data already fetched and then added to the UI.
     * 
     * @param data the data to add
     */
    public async addData( data:D ){

        if(this.append) this.data.unshift( data );
        else this.data.push( data );

        // if the newly added data will form a new batch, increment the
        if( this.data.length % this.perPage == 1 ) this.page++;
    }

    /**
     * Adds a new batch of data
     * @param newData The next batch of data to add to other batches that have been fetched
     */
    public async addNextBatch( newData:D[] ):Promise<void>{

        if( !Array.isArray(newData) || newData.length < 1 ) throw new Error(' next batch of data to be added cannot be empty ');

        const nextPage = this.nextPage;

        const data = this.data.slice( 0 , ( nextPage - 1 ) * this.perPage );

        if(this.append) data.push( ...newData );
        else data.unshift( ...newData );
        
        this.data = data;

        this.page = nextPage;
    }

    /**
     * @returns a boolean that is true when the number of data is equal to the expected number of data in all batches fetched so far 
     * else it returns false maybe because the data count in the last batch added is less than perPage.
     */
    public isBatchCountAbsolute(){
        return this.data.length >= this.page * this.perPage;
    }

    /**
     * called to return to the initial state when this object was created
     */
    public reset(){
        this.page = 0;
        this.data = [];
    }

    /**
     * called to update the batches of data in a paginatedDataManager based on an indicated type of change to be made
     * 
     * @param paginatedDataManager the paginatedManager whose batches of data should be manipulated
     * @param type the type of change to make
     * @param data the data to be reflected
     * @param comparator the comparator that is used to find which data should be replaced or removed
     */
    public static reflectDataIntoPaginatedDataManager<D>(paginatedDataManager:PaginatedDataManager<D>,type:'create'|'update'|'delete' , data:D,comparator:DATA_COMPARATOR<D>){
        if( type == 'create' ){
            paginatedDataManager.addData(data);
        }
        else if( type == 'delete' || type == 'update' ){

            const objModifyApproach = 
            type == 'delete' ? OBJ_MODIFY_APPROACH.DELETE_IN_ARRAY 
            : type == 'update' ? OBJ_MODIFY_APPROACH.SET_IN_ARRAY : undefined;

            if( objModifyApproach != undefined ) {
                paginatedDataManager.data = ObjectUtils.modifyObj<D[],D>( paginatedDataManager.data , data , objModifyApproach , comparator);
            }
        }
        else{
            throw new Error(`cannot reflect change into paginated data manager with invalid type : ${type}`);
        }
    }
}
