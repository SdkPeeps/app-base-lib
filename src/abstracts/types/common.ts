
export type ID = number|string;

export type PLAIN_OBJECT<D=any> = {[index:string]:D}

/**
 * Can be used to determine what privileges are allowed
 */
export enum ACCESS_LEVEL{ VIEW = 1 , EDIT };

export enum CRUD { CREATE = 1 , READ , UPDATE , DELETE };
