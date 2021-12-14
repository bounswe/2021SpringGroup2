package com.bounswe.findsportevents.network.modalz.responses

import java.util.*

data class ObjectResponse (

        val type : String,
        val name : String,
        val postId : Int,
        val ownerId : Int,
        val content : String,
        val title : String,
        val creationDate : Date,
        val lastUpdateDate : Date,
        val numberOfClicks : Int,
        val location : LocationResponse,
        val eventDate : Date,
        val sport : String,
        val eventMinAge : Int,
        val eventMaxAge : Int,
        val eventMinSkillLevel : Int,
        val eventMaxSkillLevel : Int,
        val eventPlayerCapacity : Int,
        val eventSpectatorCapacity : Int,
        val eventApplicants : List<Int>,
        val eventPlayers : List<Int>,

)