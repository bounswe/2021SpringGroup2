package com.bounswe.findsportevents.network.modalz.responses

data class AllEquipmentsResponse(
    val summary: String,
    val type: String,
    val totalItems: Int,
    val totalPages: Int,
    val orderedItems: List<EquipmentResponse>
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
