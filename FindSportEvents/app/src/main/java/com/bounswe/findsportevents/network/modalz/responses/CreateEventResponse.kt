package com.bounswe.findsportevents.network.modalz.responses

data class CreateEventResponse(
    val summary: String,
    val type: String,
    val actor: Actor,
    val `object`: Object,
    val eventDate: String,
    val eventSport: String,
    val eventMinAge: Int,
    val eventMaxAge: Int,
    val eventMinSkillLevel: Int,
    val eventMaxSkillLevel: Int,
    val eventPlayerCapacity: Int,
    val eventSpectatorCapacity: Int,
    val eventApplicants: List<String>, //TODO ADD APPLICANT OBJECT
    val eventPlayers: List<String> //TODO ADD PLAYER OBJECT
)

data class Actor(
    val type: String,
    val name: String
)

data class Object(
    val type: String,
    val name: String,
    val postId: Int,
    val ownerId: Int,
    val content: String,
    val title: String,
    val creationDate: String,
    val lastUpdateDate: String,
    val numberOfClicks: Int,
    val location: LocationResponse,
    val eventDate: String,
    val eventSport: String,
    val eventMinAge: Int,
    val eventMaxAge: Int,
    val eventMinSkillLevel: Int,
    val eventMaxSkillLevel: Int,
    val eventPlayerCapacity: Int,
    val eventSpectatorCapacity: Int,
    val eventApplicants: List<Int>,
    val eventPlayers: List<Int>,
)
