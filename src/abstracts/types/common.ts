
export type ID = number|string;

export type PLAIN_OBJECT<D=any> = {[index:string]:D}

export enum USER_DATA_CONTEXT{ VIEW = 1 , EDIT };

export enum CRUD { CREATE = 1 , READ , UPDATE , DELETE };
