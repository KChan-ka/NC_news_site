const {
  convertTimestampToDate,
  createReferenceObj
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createReferenceObj", () => {
  test("returns an object", () => {
    const actual = createReferenceObj([], "", "")
    expect(actual).toEqual({})
  })
  test("check for mutation", () => {
    const inputArray = [{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }]
    const controlArray = [{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }]
    createReferenceObj(inputArray, "name", "id")
    expect(inputArray).toEqual(controlArray)
  })
  test("returns ref object with key value pair matching the keys passed in when passed in arr with one obj and two keys", () => {
    const inputArray =
      [{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }]
    const actual = createReferenceObj(inputArray, "name", "id")
    expect(Object.keys(actual)[0]).toBe("Rose")
    expect(Object.values(actual)[0]).toBe("dS8rJns")
  })
  test("Test with multiple objects in the array", () => {
    const inputArray = [
      { name: "Rose", id: "dS8rJns", secretFear: "spiders" },
      { name: "Simon", id: "Pk34ABs", secretFear: "mice" },
      { name: "Jim", id: "lk1ff8s", secretFear: "bears" },
      { name: "David", id: "og8r0nV", secretFear: "Rose" },
    ]
    const result = createReferenceObj(inputArray, "name", "id")
    expect(Object.keys(result)[0]).toBe("Rose")
    expect(Object.values(result)[0]).toBe("dS8rJns")
    expect(Object.keys(result)[1]).toBe("Simon")
    expect(Object.values(result)[1]).toBe("Pk34ABs")
    expect(Object.keys(result)[2]).toBe("Jim")
    expect(Object.values(result)[2]).toBe("lk1ff8s")
    expect(Object.keys(result)[3]).toBe("David")
  })
})