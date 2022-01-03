import {datetoISOString} from "../Views/SearchEvents/EventSearch/FilterComponents/helper";


test('it helps', async () => {
    expect(datetoISOString(new Date('December 17, 1995 03:24:00'))).toBe('Sun, 17 Dec 1995 01:24:00 GMT')
    expect(datetoISOString(new Date(2020, 6, 4, 7))).toBe('Sat, 04 Jul 2020 04:00:00 GMT')
    expect(datetoISOString(new Date(new Date(2020, 7, 4, 9)))).toBe('Tue, 04 Aug 2020 06:00:00 GMT')
    expect(datetoISOString(new Date(2000, 11, 3, 15))).toBe('Sun, 03 Dec 2000 13:00:00 GMT')

})
