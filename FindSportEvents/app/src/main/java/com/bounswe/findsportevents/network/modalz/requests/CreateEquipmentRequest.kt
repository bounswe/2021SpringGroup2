package com.bounswe.findsportevents.network.modalz.requests

data class CreateEquipmentRequest(
    val content: String,
    val title : String,
    val location : String,
    val sport : String,
    val latitude : Float,
    val longitude : Float,
    val owner : Long,
    val equipment_type: String,
    val url : String,

)
