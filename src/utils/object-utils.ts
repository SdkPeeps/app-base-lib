
import { merge } from "lodash";
import { DATA_COMPARATOR } from "../abstracts/types/common";

export enum OBJ_MODIFY_APPROACH { PRE_MERGE = 1 , POST_MERGE , PREPEND , APPEND , SET_IN_ARRAY , SET , DELETE_IN_ARRAY };

/**
 * A class that contains object manipulation and utility methods
 */
export class ObjectUtils {
  
  /**
   * called to create a comparator that compares two objects
   * 
   * @param propKey The object property name whose values should be compared
   * @param as whether strict( === ) or lenient( == ) comparison should be done, else it indicates the type to cast the values to, before 
   * comparison is done
   * @param strict if equal comparison should be 
   * @returns a comparator that can be used to compare two objects
   */
  static getObjectPropComparator<T extends Object>( propKey , as : 'lenient'|'strict'|'string'|'number' ) : DATA_COMPARATOR<T>{
    return ( obj1:T , obj2:T ) => {
      const value1 = obj1[ propKey ];
      const value2 = obj2[ propKey ];

      if( as == 'strict' || as == 'lenient' ) return ( as == 'strict' ? value1 === value2 : value1 == value2 ) ? 0 : value1 > value2 ? 1 : -1;

      const absValue1 = as == 'string' ? String(value1) : Number( value1 );
      const absValue2 = as == 'string' ? String(value2) : Number( value2 );

      return absValue1 == absValue2 ? 0 : absValue1 > absValue2 ? 1 : -1;
    };
  }

  /**
   * This method can be used to modify an object based on a specified approach.
   * 
   * @param obj The object to modify
   * @param change The change to reflect
   * @param approach Indicates the kind of modification to be made
   * @param arrayComparator If the obj to modify is an array, this method will be used to compare its items when needed
   * @returns the modified object
   */
  static modifyObj<D,U>( obj:D , change:U , approach:OBJ_MODIFY_APPROACH , arrayComparator:DATA_COMPARATOR<U> ){

    // If the object is an array, this method can be used to remove the change( an item possibly in the array ) from the array
    const remove = () => {
      return Array.isArray(obj) ? obj.filter( datium => arrayComparator(datium,change) != 0 ) : obj;
    };

    // holds the result after motification
    let data;

    if( Array.isArray(obj) && (approach == OBJ_MODIFY_APPROACH.APPEND || approach == OBJ_MODIFY_APPROACH.PREPEND ) && 

    // if in the array already
    obj.findIndex( datium => arrayComparator( datium , change ) == 0 ) > -1 ){

      // remove it to avoid repetition
      obj = remove() as D;
    }

    // do the modification
    data = approach == OBJ_MODIFY_APPROACH.DELETE_IN_ARRAY ? remove()
          :approach == OBJ_MODIFY_APPROACH.PRE_MERGE ? merge( change , obj ) : approach == OBJ_MODIFY_APPROACH.POST_MERGE ? merge( obj , change )
          :approach ==  OBJ_MODIFY_APPROACH.SET ? change 
          :approach == OBJ_MODIFY_APPROACH.SET_IN_ARRAY ? 
          ( Array.isArray(obj) ? obj.map( datium => arrayComparator( datium , change ) == 0 ? change : datium ) : 
          [change] ) : ( Array.isArray(obj) ? ( approach == OBJ_MODIFY_APPROACH.PREPEND ? [change].concat(obj) 
          : obj.concat( [change] ) ) : [change] );

    return data;
  }
}
