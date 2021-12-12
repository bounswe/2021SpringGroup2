import {formatDate} from "../Views/Comments/Comment";
import * as CommentAnswerController from '../Controllers/CommentAnswerController';


describe("Check if the answers are formatted correctly given the request", () =>{
    let originalFetch;
    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
            "@context": "https://www.w3.org/ns/activitystreams",
            "summary": "Object history",
            "type": "Collection",
            "totalItems": 2,
            "items": [
            {
                "type": "Create",
                "actor": {
                    "type": "Person",
                    "name": "Sally"
                },
                "object": {
                    "answer": "I would like to participate",
                    "creationDate": "2014-11-31T23:00:00-08:00"
                }
            },
            {
                "type": "Create",
                "actor": {
                    "type": "Person",
                    "name": "Sally"
                },
                "object": {
                    "answer": "I wish I was available!",
                    "creationDate": "2014-11-31T23:00:00-12:00"
                }
            }
        ]
    })}));})
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if the response is in the correct format.",async () => {
        const response = await CommentAnswerController.getAnswersOfComment(0,0)
        expect(response).toEqual([
        {user:{username:"Sally"},content:"I would like to participate",
            creationDate:"2014-11-31T23:00:00-08:00", isAnswer:true},
        {user:{username:"Sally"},content:"I wish I was available!",
            creationDate:"2014-11-31T23:00:00-12:00", isAnswer:true}
        ])
    })
})
