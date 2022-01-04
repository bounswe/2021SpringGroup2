package com.bounswe.findsportevents.network.modalz.requests

data class ApplicantsRequest(
    val type: String,
    val user: Int,
    val owner: Int,
    val accept: Boolean
)
