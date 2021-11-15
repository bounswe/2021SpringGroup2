package com.bounswe.findsportevents.network


import com.bounswe.findsportevents.BuildConfig
import com.bounswe.findsportevents.network.modalz.requests.ObtainTokenRequest
import com.bounswe.findsportevents.network.modalz.requests.SignupRequest
import com.bounswe.findsportevents.network.modalz.responses.ObtainTokenResponse
import com.bounswe.findsportevents.network.modalz.responses.SignupResponse
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

    companion object {

        var BASE_URL = "http://34.122.205.8/"

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