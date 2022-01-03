package com.bounswe.findsportevents.network.modalz.requests

data class CommentRequest(
    val name:String,
    val ownerId: Int,
    val content : String,
    val creationDate: String,

)
