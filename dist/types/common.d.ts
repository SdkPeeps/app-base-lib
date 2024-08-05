export declare type ID = number | string;
export declare type PLAIN_OBJECT<D = any> = {
    [index: string]: D;
};
export declare enum USER_DATA_CONTEXT {
    VIEW = 1,
    EDIT = 2
}
export declare enum CRUD {
    CREATE = 1,
    READ = 2,
    UPDATE = 3,
    DELETE = 4
}
