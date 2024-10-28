// sql.test.js
const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require("../expressError");

describe('sqlForPartialUpdate', () => {
  test('works: updating a single field', () => {
    const dataToUpdate = { 
                         firstName: 'Aliya' 
                        };

    const jsToSql = { 
                    firstName: 'first_name' 
                    };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result.setCols).toEqual('"first_name"=$1');
    expect(result.values).toEqual(["Aliya"]);
  });

  test('works: updating multiple fields', () => {
    const dataToUpdate = { 
                        firstName: 'Aliya', 
                        age: 32 
                        };

    const jsToSql = { 
                    firstName: 'first_name' 
                    };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    
    expect(result.setCols).toEqual('"first_name"=$1, "age"=$2');
    expect(result.values).toEqual(["Aliya", 32]);
  });

  test('works: no jsToSql mapping provided', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = {};  // No mapping 

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    
    expect(result.setCols).toEqual('"firstName"=$1, "age"=$2');
    expect(result.values).toEqual(["Aliya", 32]);
  });

  test('throws error if no data is provided', () => {
    expect(() => {
      sqlForPartialUpdate({}, {});
    }).toThrowError("No data");
  });
});