
/**
 * A class that can be used to manage infinite scroll for a list based UI.
 * 
 * It expects data to be added in batches which basically is how infinite scroll works.
 */
export class InfiniteScrollManager<D>{

    /**
     * An array of data which comes in batches
     */
    private data:D[] = [];

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
     * 
     * @param newData The new batch of data to add to other batches that have been fetched
     */
    public async addBatch( newData:D[] ){

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
