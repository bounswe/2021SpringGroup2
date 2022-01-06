package com.bounswe.findsportevents.network.modalz.responses

data class AllCommentsResponse(
    val summary:String,
    val type : String,
    val totalItems : Int,
    val items : List<ItemResponse>
)
data class ItemResponse(
    val type : String,
    val actor : ActorResponse,
    val `object` : CommentResponse
)
data class CommentResponse(
    val type : String,
    val postId : Int,
    val id : Int,
    val ownerId : Int,
    val content : String,
    val creationDate : String
)
