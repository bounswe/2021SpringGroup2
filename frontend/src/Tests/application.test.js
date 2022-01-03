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

