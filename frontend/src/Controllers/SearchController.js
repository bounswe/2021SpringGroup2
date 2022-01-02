import {initialFilters} from "../Views/SearchEvents/Index";

export function  searchEvents(params={}){

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    const url = Object.keys(params).map(function(k) {
        return params[k]===initialFilters[k]?"h=h": encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    }).join('&')
    console.log(url)
    return fetch("/api/posts/?"+url,options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export function  getEvent(id){

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    return fetch("/api/posts/"+id+'/',options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export function searchBySport(sport){
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    const url = "sport="+sport
    return fetch("/api/posts/?"+url,options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}