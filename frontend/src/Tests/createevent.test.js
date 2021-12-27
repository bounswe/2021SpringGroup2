import {checkIfDateIsLater,checkIfNumber} from "../Views/Create Event/CreateEventPage";

test("Check if dates are compared correctly. First argument must be before the second one.",()=>{
    expect(checkIfDateIsLater("2014-11-30T23:00:00-08:00","2014-11-30T23:01:00-08:00")).toBe(true)
    expect(checkIfDateIsLater("2021-01-12T13:42:00+03:00","2021-01-12T13:41:00+03:00")).toBe(false)

    expect(checkIfDateIsLater("2014-11-30T22:00:00-08:00","2014-11-30T23:00:00-08:00")).toBe(true)
    expect(checkIfDateIsLater("2021-01-12T15:42:00+03:00","2021-01-12T14:42:00+03:00")).toBe(false)

    expect(checkIfDateIsLater("Sat Nov 13 10:45:00 2021","Sat Nov 14 10:45:00 2021")).toBe(true)
    expect(checkIfDateIsLater("12/17/1997 07:37:16.00 PST","12/16/1997 07:37:16.00 PST")).toBe(false)

    expect(checkIfDateIsLater("2014-11-30T23:00:00-08:00","2014-12-30T23:00:00-08:00")).toBe(true)
    expect(checkIfDateIsLater("2021-02-12T13:41:00+03:00","2021-01-12T13:41:00+03:00")).toBe(false)

    expect(checkIfDateIsLater("2014-11-30T23:00:00-08:00","2015-11-30T23:00:00-08:00")).toBe(true)
    expect(checkIfDateIsLater("2021-01-12T13:42:00+03:00","2020-01-12T13:42:00+03:00")).toBe(false)
})

test("Check if integer strings are identified correctly",()=>{
    expect(checkIfNumber(1)).toBe(true)
    expect(checkIfNumber(12)).toBe(true)
    expect(checkIfNumber(100)).toBe(true)
    expect(checkIfNumber(1.0)).toBe(true)
    expect(checkIfNumber(1.00001)).toBe(true)
    expect(checkIfNumber(0.900000)).toBe(true)

    expect(checkIfNumber("1")).toBe(true)
    expect(checkIfNumber("10")).toBe(true)
    expect(checkIfNumber("110")).toBe(true)
    expect(checkIfNumber("0.9")).toBe(true)
    expect(checkIfNumber("1.0")).toBe(true)
    expect(checkIfNumber("1.0000001")).toBe(true)
    expect(checkIfNumber("12.0 ")).toBe(true)


    expect(checkIfNumber("11a")).toBe(false)
    expect(checkIfNumber("berkay123")).toBe(false)
    expect(checkIfNumber("a12.3")).toBe(false)
    expect(checkIfNumber("12.3a")).toBe(false)
    expect(checkIfNumber("12 3")).toBe(false)
    expect(checkIfNumber("11. 34")).toBe(false)
    expect(checkIfNumber("a12")).toBe(false)
})