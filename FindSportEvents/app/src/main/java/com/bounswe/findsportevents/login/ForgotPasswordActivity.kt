package com.bounswe.findsportevents.login

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.findsportevents.databinding.ActivityForgotPasswordBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.ResetPasswordRequest
import com.bounswe.findsportevents.network.modalz.responses.ResetPasswordResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ForgotPasswordActivity: AppCompatActivity() {
    private lateinit var binding: ActivityForgotPasswordBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityForgotPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initListeners()
    }

    private fun initListeners() {
       binding.buttonResetPassword.setOnClickListener {
           if(binding.etEmail.text != null){
               val request = ResetPasswordRequest(binding.etEmail.text.toString())
               ReboundAPI.create().resetPassword(request).enqueue(object: Callback<ResetPasswordResponse> {
                   override fun onResponse(
                       call: Call<ResetPasswordResponse>,
                       response: Response<ResetPasswordResponse>
                   ) {
                       if(response.isSuccessful && response.body()!!.status == "OK"){
                           Toast.makeText(
                               applicationContext,
                               "Email sent!",
                               Toast.LENGTH_LONG
                           ).show()
                           startActivity<ResetPasswordActivity> {
                               addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                           }
                       }else{
                           Toast.makeText(
                               applicationContext,
                               "An error occurred, check your credentials and try again",
                               Toast.LENGTH_LONG
                           ).show()
                           //TODO get error message from network and show it via Toast message
                       }
                   }

                   override fun onFailure(call: Call<ResetPasswordResponse>, t: Throwable) {
                       Toast.makeText(
                           applicationContext,
                           "Server error occurred, try again later",
                           Toast.LENGTH_LONG
                       ).show()
                   }

               })
           }
       }
    }
}