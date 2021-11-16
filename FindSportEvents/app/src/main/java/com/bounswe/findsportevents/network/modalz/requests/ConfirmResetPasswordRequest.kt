package com.bounswe.findsportevents.network.modalz.requests

data class ConfirmResetPasswordRequest(
    val password: String,
    val token: String
)
