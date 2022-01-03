import * as ApplicationsController from "../Controllers/ApplicationsController"


describe("Check if user information is listed correctly", () =>{
    let originalFetch;
    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                "id": 1,
                "first_name": "Berkay",
                "last_name": "Doner",
                "username": "berkaydoner",
                "bio": "",
                "fav_sport_1": "",
                "fav_sport_2": "",
                "fav_sport_3": "",
                "location": "Istanbul",
                "avatar": "",
                "privacy": false,
                "badges": [],
                "birthday": "1999-11-13"
            })}));})
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if the response is in the correct format.",async () => {
        const response = await ApplicationsController.getUserListInfo([1,2,3])
        expect(response).toEqual([
            {username:"berkaydoner",avatar:"",user_id:1},
            {username:"berkaydoner",avatar:"",user_id:1},
            {username:"berkaydoner",avatar:"",user_id:1}
        ])
    })
})

describe("Check applicant list fetching", () =>{
    let originalFetch;
    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
            "applicants":[1,2,3]
            })}));})
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if the response is in the correct format.",async () => {
        const spy1 = jest.spyOn(ApplicationsController,"getUserListInfo")
        const response = await ApplicationsController.getApplicationsToAnEvent(0)
        expect(response).toHaveLength(3)
        expect(spy1).toHaveBeenCalledWith([1,2,3])
        expect(spy1).toHaveBeenCalledTimes(1)
    })
})
describe("Check application request", () =>{

    let originalFetch;
    let request;
    beforeEach(() => {
        localStorage.setItem('username', "berkaydoner")
        localStorage.setItem('user_id', 1)
        originalFetch = global.fetch;
        global.fetch = jest.fn((x,options) => {request=options})
    })
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if the response is in the correct format.",async () => {
        const response = await ApplicationsController.applyToEvent(0,"player")
        expect(request.body).toEqual(
            "{\"user\":\"1\",\"type\":\"player\"}"
        )
        expect(request.method).toEqual("POST")
    })
    localStorage.removeItem('username')
    localStorage.removeItem('user_id')
})

describe("Check evaluation request", () =>{

    let originalFetch;
    let request;
    beforeEach(() => {
        localStorage.setItem('username', "berkaydoner")
        localStorage.setItem('user_id', 1)
        originalFetch = global.fetch;
        global.fetch = jest.fn((x,options) => {request=options})
    })
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if the response is in the correct format.",async () => {
        const response = await ApplicationsController.evaluateApplication(0,0,"player",true,1)
        expect(request.body).toEqual(
            "{\"user\":0,\"type\":\"player\",\"owner\":1,\"accept\":true}"
        )
        expect(request.method).toEqual("POST")
    })
    localStorage.removeItem('username')
    localStorage.removeItem('user_id')
})