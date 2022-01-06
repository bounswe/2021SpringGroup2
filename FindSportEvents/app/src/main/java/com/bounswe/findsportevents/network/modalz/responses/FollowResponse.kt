package com.bounswe.findsportevents.network.modalz.responses

data class FollowResponse(
    val message : String

)
 data class UnfollowResponse(
     val message : String,
 )
data class GetFollowingsResponse(
    val summary : String,
    val type :String,
    val total_items : Int,
    val items : List<FollowedUserResponse>
)
data class FollowedUserResponse(
    val summary:String,
    val type: String,
    val actor : ActorResponse,
    val `object` : FollowedUser
)
data class FollowedUser(
    val type:String,
    val identifier : String
)
