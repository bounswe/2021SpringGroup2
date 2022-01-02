import {checkEmailValidity, checkPasswordValidity} from "../Views/Login/ForgotPassword";

test("Check if email format is checked correctly",()=> {
    expect(checkEmailValidity("berkaydoner")).toBe(false)
    expect(checkEmailValidity("berkay.doner")).toBe(false)
    expect(checkEmailValidity("berkay.@doner")).toBe(false)
    expect(checkEmailValidity("berkay@doner")).toBe(false)
    expect(checkEmailValidity("berkay@d.oner")).toBe(true)
    expect(checkEmailValidity("berkay@don.er.er")).toBe(true)
    expect(checkEmailValidity("berkaydoner@gmail.com")).toBe(true)
    expect(checkEmailValidity("berkaydoner@gmail.com.tr")).toBe(true)
    expect(checkEmailValidity("berkaydoner@gmail.edu.tr")).toBe(true)

})
test("Check if password format is checked correctly",()=> {
    expect(checkPasswordValidity("123")).toBe(false)
    expect(checkPasswordValidity("123be")).toBe(false)
    expect(checkPasswordValidity("123berkay123")).toBe(false)
    expect(checkPasswordValidity("1Berkay")).toBe(false)
    expect(checkPasswordValidity("BerkayDo")).toBe(false)
    expect(checkPasswordValidity("123berkay")).toBe(false)
    expect(checkPasswordValidity("123BERKAY")).toBe(false)
    expect(checkPasswordValidity("Berkay123")).toBe(true)
    expect(checkPasswordValidity("123Berkay123")).toBe(true)
    expect(checkPasswordValidity("1Be2RkaY3")).toBe(true)
    expect(checkPasswordValidity("berkayY123")).toBe(true)
})