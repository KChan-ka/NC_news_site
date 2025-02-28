const db = require("../../db/connection");

const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) 
    return { ...otherProperties };
  return { 
    created_at: new Date(created_at), ...otherProperties 
  };
};

// createReferenceObj
//
// Takes an array of objects and 2 keys and returns an object where key and value is generated from input keys
//
// @arr - array of objects
// key1 - string
// key2 - string
//
// example: 
// arr [{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }]
// key1 = "name"
// key2 = "id"
//
// will generate {"Rose" : "dS8rJns"}
//

function createReferenceObj(arr, key1, key2) {
  const refObj = {}
  arr.forEach((obj) => {
    refObj[obj[key1]] = obj[key2]
  })
  return refObj
}

module.exports = {
  createReferenceObj, 
  convertTimestampToDate
}

