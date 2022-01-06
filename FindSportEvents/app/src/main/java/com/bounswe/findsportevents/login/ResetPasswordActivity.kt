package com.bounswe.findsportevents.login

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import com.bounswe.findsportevents.databinding.ActivityResetPasswordBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.ConfirmResetPasswordRequest
import com.bounswe.findsportevents.network.modalz.responses.ConfirmResetPasswordResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ResetPasswordActivity : AppCompatActivity() {
    private lateinit var binding: ActivityResetPasswordBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityResetPasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initListeners()
    }

    private fun initListeners() {
        binding.etNewPassword.doAfterTextChanged {
            checkFields()
        }
        binding.etConfirmPassword.doAfterTextChanged {
            checkFields()
        }
        binding.buttonResetPassword.setOnClickListener {
            val request = ConfirmResetPasswordRequest(
                binding.etNewPassword.text.toString(),
                binding.etToken.text.toString()
            )
            ReboundAPI.create().confirmResetPassword(request)
                .enqueue(object : Callback<ConfirmResetPasswordResponse> {
                    override fun onResponse(
                        call: Call<ConfirmResetPasswordResponse>,
                        response: Response<ConfirmResetPasswordResponse>
                    ) {
                        if (response.isSuccessful && response.body()!!.status == "OK") {
                            Toast.makeText(
                                applicationContext,
                                "Password reset successful",
                                Toast.LENGTH_LONG
                            ).show()
                            startActivity<LoginActivity> {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                            }
                        } else {
                            Toast.makeText(
                                applicationContext,
                                "An error occurred, check your credentials and try again",
                                Toast.LENGTH_LONG
                            ).show()
                            //TODO get error message from network and show it via Toast message
                        }
                    }

                    override fun onFailure(call: Call<ConfirmResetPasswordResponse>, t: Throwable) {
                        Toast.makeText(
                            applicationContext,
                            "Server error occurred, try again later",
                            Toast.LENGTH_LONG
                        ).show()
                    }

                })
        }
    }

    private fun checkFields() {
        binding.buttonResetPassword.isEnabled =
            binding.etNewPassword.text.toString().length >= 5 && binding.etConfirmPassword.text.toString().length >= 5
                    && binding.etNewPassword.text.toString() == binding.etConfirmPassword.text.toString()
    }
}