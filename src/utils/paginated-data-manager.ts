
/**
 * A class that can be used to manage pagination for a growing list of data. A list based UI can use it to perform infinite scroll.
 * 
 * It expects data to be added in batches which basically is how pagination works for a growing list.
 */
export class PaginatedDataManager<D>{

    /**
     * An array of data which comes in batches
     */
    public data:D[] = [];

    /**
     * The number of data that is loaded in a batch
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
     * adds a single data to the list of data. The data will be added to the opposite end of where the next batch will be added.
     * 
     * @example In a case a list UI uses this class to manage its data and a new data was created which needs to be posted to server 
     * and added to the ui, then the data should first be posted and if successful this method should be called to add the data to the 
     * list of data.
     * 
     * @param datium the data to add
     */
    public async addDatium( datium:D ){

        if(this.append) this.data.unshift( datium );
        else this.data.push( datium );

        // check if the newly added data will form a new batch
        if( this.data.length % this.perPage == 1 ) this.page++;
    }

    /**
     * 
     * @param newData The next batch of data to add to other batches that have been fetched
     */
    public async addNextBatch( newData:D[] ){

        const data = this.data.slice( 0 , this.page * this.perPage );

        if(this.append) data.push( ...newData );
        else data.unshift( ...newData );
        
        this.data = data;

        this.page++;
    }

    /**
     * 
     * @returns a boolean that is true when the number of data is equal to the expected number of data in all batches fetched so far 
     * else it returns false maybe because the data count in the last batch is less than perPage.
     */
    public isBatchCountAbsolute(){
        return this.data.length >= this.page * this.perPage;
    }
}
