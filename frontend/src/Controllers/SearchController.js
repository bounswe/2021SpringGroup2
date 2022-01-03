import {initialFilters} from "../Views/Search/Index";
import {useState} from "react";

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
    return fetch("http://34.68.66.109/api/posts/"+id+'/',options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export function searchEventBySport(sport){
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    const url = "sport="+sport
    return fetch("http://34.68.66.109/api/posts/?"+url,options)
        .then(response=>response.json())
        .then(r=>r.results)
        .then(r=>r.length>3?r.slice(0, 3):r)
        .then(r=>{console.log(r); return r})
}

export function searchEquipmentBySport(sport){
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    const url = "sport="+sport
    return fetch("http://34.68.66.109/api/equipments/?"+url,options)
        .then(response=>response.json())
        .then(r=>r.results)
        .then(r=>r.length>3?r.slice(0, 3):r)
        .then(r=>{console.log(r); return r})
}




export function  searchEquipments(params={}){

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    const url = Object.keys(params).map(function(k) {
        return params[k]===initialFilters[k]?"h=h": encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    }).join('&')
    console.log(url)
    return fetch("/api/equipments/?"+url,options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}

export function  getEquipment(id){

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    return fetch("/api/equipments/"+id+'/',options)
        .then(response=>response.json())
        .then(r=>{console.log(r); return r})
}