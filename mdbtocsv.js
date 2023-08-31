import { query } from "@el3um4s/node-mdb";
import fs from 'fs'
const database = "./Weighing_API.mdb";

// const result = await table.list({ database });
const sql = `
  SELECT * from API_DATA;`;
const result = await query.sql({
  database,
  sql,
})


// Filter out the first and second properties
const filteredData = result.map(item => {
  const { T_ID, WB_Location_ID, ...rest } = item;
  return rest;
});

// Create a JSON object with keys and values in inverted commas
const formattedJSON = {};

for (let i = 0; i < filteredData.length; i++) {
  const formattedItem = {};
  for (const [key, value] of Object.entries(filteredData[i])) {
    formattedItem[`${key}`] = `${value}`;
  }
  const formattedArr = []
  formattedArr.push(formattedItem);
  formattedJSON[result[i].T_ID] = formattedArr;
  console.log(formattedJSON)
  // console.log(result[i].WB_Location_ID)
}
let newResult = {};
newResult[result[0].WB_Location_ID] = formattedJSON;

// console.log("this is new resjut",newResult);
// console.log(result);
fs.writeFile('db.json', JSON.stringify(newResult, null, 2), (err) => {
  if (err) {
    console.error('Error writing to db.json:', err);
    return;
  }
  console.log('Data written to db.json');
});