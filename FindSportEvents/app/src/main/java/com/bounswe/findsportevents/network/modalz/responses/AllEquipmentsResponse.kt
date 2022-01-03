package com.bounswe.findsportevents.network.modalz.responses

data class AllEquipmentsResponse(
    val count: Int,
    val next : String,
    val previous : String,
    val results : List<EquipmentResponse2>
)

data class EquipmentResponse(
        val type : String,
        val postId : Int,
        val ownerId : Int,
        val content : String,
        val title : String,
        val creationDate: String,
        val lastUpdateDate : String,
        val numberOfClicks : Int,
        val location : LocationResponse,
        val url : String,
        val sport : String,
        val equipmentType : String
)
data class EquipmentResponse2(
    val id : Int,
    val content : String,
    val title : String,
    val equipment_type: String
)
data class EquipmentbyIdResponse(
    val summary : String,
    val type : String,
    val actor : ActorResponse,
    val `object` : EquipmentResponse
)
