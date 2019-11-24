/**
 * GroupBy array extension
 */

interface Grouping<T> {
  key: string,
  values: Array<T>,
  computed: any
}

interface Array<T> {
  groupBy(prop: T, opCallBack: (group: Grouping<T>, item: T) => any): Grouping<T>[];
}

// Nested property support
function getVal(obj, prop) {
  const props = prop.split('.');
  if (props.length === 1) {
    return obj[prop];
  } else {
    return getVal(obj[props[0]], prop.slice(prop.indexOf('.') + 1, prop.length));
  }
}

if (!Array.prototype.groupBy) {
  // Return an array of 'Grouping' object
  Array.prototype.groupBy = function (prop: string, opCallBack: (group: Grouping<any>, item: any) => any = null) {
    return this.reduce((data, item) => {
      // Get value
      const val = getVal(item, prop);
      // Search val
      if (data.filter(g => g.key === val).length === 0) {
        data.push({
          key: val,
          values: []
        });
      }
      if(opCallBack) {
        opCallBack(data.find(g => g.key === val), item);
      }
      data.find(g => g.key === val).values.push(item);
      return data;
    }, []);
  }
}

/* End */
