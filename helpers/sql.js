const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/**
 * Generates SQL for a partial update query.
 * 
 *  dataToUpdate -  the fields to be updated and their new values.
 *  jsToSql -  mapping JavaScript-style field names to their corresponding SQL column names.
 * 
 * returns -  the SQL query string (`setCols`) and an array of values (`values`).
 * 
 * Example:
 * dataToUpdate = { firstName: 'Aliya', age: 32 }
 * jsToSql = { firstName: 'first_name'}
 * Returns:
 * {
 *   setCols: '"first_name"=$1, "age"=$2',
 *   values: ['Aliya', 32]
 * }
 *  throws a Error - If no data is provided to update
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
