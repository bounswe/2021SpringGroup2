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
import java.util.*
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

    @GET("api/users/{username}")
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

        ): Call<AllEventsResponse>
    @GET("api/posts/")
    fun searchEvents(
        @Header("Authorization") token: String,
        @Query("request") request: SearchEventRequest
    ):Call<AllEventsResponse>

    @POST("api/posts/")
    fun createEvent(
        @Header("Authorization") token: String,
        @Body request: CreateEventRequest
    ): Call<CreateEventResponse>

    @GET("api/posts/{eventId}")
    fun getEventbyId(
        @Header("Authorization") token : String,
        @Path("eventId") eventId : Int,
    ): Call<EventResponse>

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