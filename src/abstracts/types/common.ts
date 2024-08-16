
export type ID = number|string;

export type PLAIN_OBJECT<D=any> = {[index:string]:D}

export enum CRUD { CREATE = 1 , READ , UPDATE , DELETE };
