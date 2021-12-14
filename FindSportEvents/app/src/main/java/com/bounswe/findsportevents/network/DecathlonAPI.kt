package com.bounswe.findsportevents.network

import com.bounswe.findsportevents.BuildConfig
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.network.modalz.responses.DataResponse
import com.bounswe.findsportevents.network.modalz.responses.GetSportsResponse
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path
import java.util.concurrent.TimeUnit

interface DecathlonAPI {
    @GET("/")
    fun getSports(


    ): Call<GetSportsResponse>

    companion object {

        var BASE_URL = "https://sports.api.decathlon.com/sports/"

        fun create(): DecathlonAPI {

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

            return retrofit.create(DecathlonAPI::class.java)

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