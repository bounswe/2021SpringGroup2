import {getValue} from "../Views/Search/EventSearch/FilterComponents/helper";

test("Check if values are correct when camelcase",()=> {
    expect(getValue({
        ids: ["minSkillLevel", "maxSkillLevel"],
        minSkillLevel: "5",
        maxSkillLevel: "9",
    })).toBe([5,9])
    expect(getValue({
        ids: ["minAge", "maxAge"],
        minAge: "30",
        maxAge: "90",
    })).toBe([30,90])
    expect(getValue({
        ids: ["minSpectators", "maxSpectators"],
        minSpectators: "55",
        maxSpectators: "900",
    })).toBe([55,900])
    expect(getValue({
        ids: ["minPlayers", "maxPlayers"],
        minPlayers: "0",
        maxPlayers: "1",
    })).toBe([0,1])
})
test("Check if values are correct when kebab case",()=> {
    expect(getValue({
        ids: ["min-skill-level","max-skill-level"],
        "min-skill-level": "5",
        "max-skill-level": "9",
    })).toBe([5,9])
    expect(getValue({
        ids: ["min-age","max-age"],
        "min-age": "30",
        "max-age": "90",
    })).toBe([30,90])
    expect(getValue({
        ids: ["min-spectators","max-spectators"],
        "min-spectators": "55",
        "max-spectators": "900",
    })).toBe([55,900])
    expect(getValue({
        ids: ["min-players","max-players"],
        "min-players": "0",
        "max-players": "1",
    })).toBe([0,1])
})
test("Check if values are correct when lowercase",()=> {
    expect(getValue({
        ids: ["minskilllevel","maxskilllevel"],
        minskilllevel: "5",
        maxskilllevel: "9",
    })).toBe([5,9])
    expect(getValue({
        ids: ["minage","maxage"],
        minage: "30",
        maxage: "90",
    })).toBe([30,90])
    expect(getValue({
        ids: ["minspectators","maxspectators"],
        minspectators: "55",
        maxspectators: "900",
    })).toBe([55,900])
    expect(getValue({
        ids: ["minplayers","maxplayers"],
        minplayers: "0",
        maxplayers: "1",
    })).toBe([0,1])
})
test("Check if values are correct when payload is big",()=> {
    expect(getValue({
        ids: ["minSkillLevel", "maxSkillLevel"],
        minSkillLevel: "5",
        maxSkillLevel: "9",
        minAge: "30",
        maxAge: "90",
        minSpectators: "55",
        maxSpectators: "900",
        minPlayers: "0",
        maxPlayers: "1",
    })).toBe([5,9])
    expect(getValue({
        ids: ["minAge", "maxAge"],
        minSkillLevel: "5",
        maxSkillLevel: "9",
        minAge: "30",
        maxAge: "90",
        minSpectators: "55",
        maxSpectators: "900",
        minPlayers: "0",
        maxPlayers: "1",
    })).toBe([30,90])
    expect(getValue({
        ids: ["minSpectators", "maxSpectators"],
        minSkillLevel: "5",
        maxSkillLevel: "9",
        minSpectators: "55",
        maxSpectators: "900",
        minAge: "30",
        maxAge: "90",
        minPlayers: "0",
        maxPlayers: "1",
    })).toBe([55,900])
    expect(getValue({
        ids: ["minPlayers", "maxPlayers"],
        minSkillLevel: "5",
        maxSkillLevel: "9",
        minPlayers: "0",
        maxPlayers: "1",
        minAge: "30",
        maxAge: "90",
        minSpectators: "55",
        maxSpectators: "900",
    })).toBe([0,1])
})
