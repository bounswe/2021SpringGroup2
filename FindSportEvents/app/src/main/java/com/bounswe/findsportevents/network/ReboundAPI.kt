package com.bounswe.findsportevents.network


import com.bounswe.findsportevents.BuildConfig
import com.bounswe.findsportevents.network.modalz.requests.*
import com.bounswe.findsportevents.network.modalz.responses.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit


interface ReboundAPI {

    @POST("api/user/create/")
    fun createUser(
        @Body request: SignupRequest
    ): Call<SignupResponse>

    @POST("api/token/obtain/")
    fun obtainToken(
        @Body request: ObtainTokenRequest
    ): Call<ObtainTokenResponse>

    @POST("api/password/reset/")
    fun resetPassword(
        @Body request: ResetPasswordRequest
    ): Call<ResetPasswordResponse>

    @POST("api/password/reset/confirm/")
    fun confirmResetPassword(
        @Body request: ConfirmResetPasswordRequest
    ): Call<ConfirmResetPasswordResponse>

    @GET("api/users/{username}/")
    fun getUser(
        @Header("Authorization") token: String,
        @Path("username") username: String
    ): Call<UserResponse>

    @PUT("api/users/{username}/")
    fun updateUser(
        @Header("Authorization") token: String,
        @Path("username") username: String,
        @Body request: UpdateProfileRequest
    ): Call<UpdateProfileResponse>

    @GET("api/posts/")
    fun getEvents(
        @Header("Authorization") token: String,
        @Query("page") page: Int

        ): Call<AllEventsResponse>
    @GET("api/posts/")
    fun searchEvents(
        @Header("Authorization") token: String,
        @Query("page") page: Int,
        @Query("query") query : String,
        @Query("sport") sport : String,
        @Query("min_skill") min_skill : Int,
        @Query("max_skill") max_skill : Int,
        @Query("min_age") min_age : Int,
        @Query("max_age") max_age : Int,
        @Query("min_duration") min_duration : Int,
        @Query("max_duration") max_duration : Int,
        @Query("min_date") min_date : String,
        @Query("max_date") max_date : String,
        @Query("min_latitude") min_latitude: Float,
        @Query("max_latitude") max_latitude: Float,
        @Query("min_longitude") min_longitude: Float,
        @Query("max_longitude") max_longitude: Float,
    ):Call<AllEventsResponse>
    @GET("api/posts/")
    fun myEvents(
        @Header("Authorization") token: String,
        @Query("page") page: Int,
        @Query("owner") owner: Long,

    ):Call<AllEventsResponse>


    @POST("api/posts/")
    fun createEvent(
        @Header("Authorization") token: String,
        @Body request: CreateEventRequest
    ): Call<CreateEventResponse>
    @POST("api/posts/{postId}/comments/")
    fun postComment(
        @Header("Authorization") token: String,
        @Path("postId") postId : Int,
        @Body request: CommentRequest
    ): Call<CommentResponse>
    @POST("api/equipments/{postId}/comments/")
    fun postEquipmentComment(
        @Header("Authorization") token: String,
        @Path("postId") postId : Int,
        @Body request: CommentRequest
    ): Call<CommentResponse>
    @POST("api/equipments/")
    fun createEquipment(
        @Header("Authorization") token: String,
        @Body request: CreateEquipmentRequest
    ): Call<EquipmentbyIdResponse>
    @POST("api/posts/{eventId}/apply/")
    fun applyToEvent(
        @Header("Authorization") token: String,
        @Path("eventId") eventId : Int,
        @Body request: ApplyRequest
    ): Call<EventbyIdResponse>

    @GET("api/posts/{eventId}/")
    fun getEventbyId(
        @Header("Authorization") token : String,
        @Path("eventId") eventId : Int,
    ): Call<EventbyIdResponse>
    @GET("api/posts/{postId}/comments/")
    fun getAllComments(
        @Header("Authorization") token : String,
        @Path("postId") postId : Int,
    ): Call<AllCommentsResponse>
    @GET("api/equipments/{postId}/comments/")
    fun getAllEquipmentComments(
        @Header("Authorization") token : String,
        @Path("postId") postId : Int,
    ): Call<AllCommentsResponse>
    @GET("api/equipments/")
    fun getEquipments(
        @Header("Authorization") token : String,
        @Query("sport") sport : String,
    ): Call<AllEquipmentsResponse>
    @GET("api/equipments/{equipmentId}/")
    fun getEquipmentbyId(
        @Header("Authorization") token : String,
        @Path("equipmentId") equipmentId : Int,
    ): Call<EquipmentbyIdResponse>
    @GET("api/equipments/{equipmentId}/comments/{commentId}/answers/")
    fun getEquipmentAnswers(
        @Header("Authorization") token : String,
        @Path("equipmentId") equipmentId : Int,
        @Path("commentId") commentId : Int,
    ): Call<AllCommentsResponse>
    @GET("api/posts/{eventId}/comments/{commentId}/answers/")
    fun getEventAnswers(
        @Header("Authorization") token : String,
        @Path("eventId") eventId : Int,
        @Path("commentId") commentId : Int,
    ): Call<AllCommentsResponse>
    @POST("api/posts/{eventId}/comments/{commentId}/answers/")
    fun postEventAnswers(
        @Header("Authorization") token : String,
        @Path("eventId") eventId : Int,
        @Path("commentId") commentId : Int,
        @Body content : MutableMap<String,String>
    ): Call<CommentResponse>
    @POST("api/equipments/{equipmentId}/comments/{commentId}/answers/")
    fun postEquipmentAnswers(
        @Header("Authorization") token : String,
        @Path("equipmentId") equipmentId : Int,
        @Path("commentId") commentId : Int,
        @Body content : MutableMap<String,String>
    ): Call<CommentResponse>
    @GET("api/users/{username}/follow/")
    fun followUser(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<FollowResponse>
    @GET("api/users/{username}/unfollow/")
    fun unfollowUser(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<UnfollowResponse>
    @GET("api/users/{username}/followings/")
    fun getFollowings(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<GetFollowingsResponse>
    @GET("api/users/{username}/followers/")
    fun getFollowers(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<GetFollowingsResponse>
    @GET("api/users/{username}/block/")
    fun blockUser(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<BlockResponse>
    @GET("api/users/{username}/unblock/")
    fun unblockUser(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<BlockResponse>
    @GET("api/users/{username}/blockings/")
    fun getBlockings(
        @Header("Authorization") token : String,
        @Path("username") username : String,
    ): Call<GetFollowingsResponse>
    @GET("api/users/")
    fun searchUser(
        @Header("Authorization") token : String,
        @Query("query") query : String,
    ): Call<AllUserResponse>
    @GET("api/posts/")
    fun getPlayedEvents(
        @Header("Authorization") token : String,
        @Query("player") player : Int,
    ): Call<PlayedEventsResponse>



    @GET("api/users/{username}/related-events/")
    fun getRelatedEvents(
        @Header("Authorization") token : String,
        @Path("username") target: String
    ): Call<RelatedEventResponse>

    @GET("api/badges/")
    fun getBadges(
        @Header("Authorization") token : String
    ): Call<GetBadgesResponse>

    @POST("api/users/{username}/badges/")
    fun giveABadge(
        @Header("Authorization") token : String,
        @Path("username") target: String,
        @Body request: GiveBadgeRequest,
    ): Call<GiveBadgeResponse>

    @GET("api/posts/{id}/applicants/")
    fun getApplicants(
        @Header("Authorization") token : String,
        @Path("id") eventId: String,
        @Query("type") type : String
    ): Call<ApplicantListResponse>


    @POST("api/posts/{id}/applicants/")
    fun acceptOrRejectApplicants(
        @Header("Authorization") token : String,
        @Path("id") eventId: String,
        @Body request: ApplicantsRequest
    ): Call<ApplicantsResponse>

    companion object {

        var BASE_URL = "http://34.68.66.109/"

        fun create(): ReboundAPI {

            val okHttpClient = OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
                .addInterceptor(provideLoggingInterceptor())
                .build()

            val retrofit = Retrofit.Builder()
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .baseUrl(BASE_URL)
                .build()

            return retrofit.create(ReboundAPI::class.java)

        }

        private fun provideLoggingInterceptor(): HttpLoggingInterceptor {
            val logging = HttpLoggingInterceptor()
            logging.level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
            return logging
        }
    }
}