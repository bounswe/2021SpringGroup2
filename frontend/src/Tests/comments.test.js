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
describe("Check if the comment is in correct format and it fetches answers", () =>{
    let originalFetch;
    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                    "@context": "https://www.w3.org/ns/activitystreams",
                    "summary": "Sally created a comment",
                    "type": "Create",
                    "actor": {
                    "type": "Person",
                        "name": "Sally"
                    },
                    "object": {
                    "type": "Comment",
                        "postId": "",
                        "ownerId": "",
                        "content": "A Simple Comment",
                        "creationDate": "2014-11-31T23:00:00-08:00"
                     }
    })}));})
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if the response is in the correct format and function calls are correct",async () => {
        const spy = jest.spyOn(CommentAnswerController,"getAnswersOfComment")
        const response = await CommentAnswerController.getCommentByID(11,14)
        expect(spy).toBeCalledWith(11,14)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(response).toEqual( {
            user: { username: 'Sally' },
            content: 'A Simple Comment',
            creationDate: '2014-11-31T23:00:00-08:00',
            isAnswer: false,
            comment_id: 14
        })
        spy.mockClear()
    })
})
describe("Check if the correct comments and answers are fetched given the request", () =>{
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
                        "object": "/api/posts/13/comments/12"
                    },
                    {
                        "type": "Create",
                        "actor": {
                            "type": "Person",
                            "name": "Sally"
                        },
                        "object": "/api/posts/13/comments/11"
                    }
                ]
            })}));})
    afterEach(() => {
        global.fetch = originalFetch;
    });
    it("Check if function calls are correct",async () => {
        const spy1 = jest.spyOn(CommentAnswerController,"getCommentByID")
        const spy2 = jest.spyOn(CommentAnswerController,"getAnswersOfComment")
        await CommentAnswerController.getCommentsAndAnswersOfEvent(13)
        expect(spy1).toHaveBeenCalledWith(13,12)
        expect(spy1).toHaveBeenCalledWith(13,11)
        expect(spy1).toHaveBeenCalledTimes(2)
    })
})

test('Check if correct post request is sent when creating comment', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({ json: () => Promise.resolve([]) })
    )
    const json = await CommentAnswerController.postComment(0,0,"berkaydoner","Hello")
    expect(json.user).toEqual({ username: 'berkaydoner' })
    expect(json.content).toBe("Hello")
    expect(json.isAnswer).toBe(false)
    expect(json.answers).toEqual([])
    global.fetch.mockClear()
})

