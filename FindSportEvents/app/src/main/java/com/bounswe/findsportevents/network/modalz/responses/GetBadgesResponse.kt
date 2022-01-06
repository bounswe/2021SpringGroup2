package com.bounswe.findsportevents.network.modalz.responses

data class GetBadgesResponse(
    val summary:String,
    val type : String,
    val totalItems : Int,
    val items: List<ItemsResponse>
)

data class ItemsResponse(
    val type: String,
    val name: String,
    val content: String,
    val icon: IconResponse
)

data class IconResponse(
    val type: String,
    val content: String
)
