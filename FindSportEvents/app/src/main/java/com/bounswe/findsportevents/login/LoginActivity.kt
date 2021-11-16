package com.bounswe.findsportevents.login

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.findsportevents.main.MainActivity
import com.bounswe.findsportevents.databinding.ActivityLoginBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.ObtainTokenRequest
import com.bounswe.findsportevents.network.modalz.responses.ObtainTokenResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initListeners()
    }

    private fun initListeners() {
        binding.etUsername.addTextChangedListener(object: TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }

        })

        binding.etPassword.addTextChangedListener(object: TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }

        })

        binding.buttonLogin.setOnClickListener {
            val obtainTokenRequest = ObtainTokenRequest(
                binding.etUsername.text.toString(),
                binding.etPassword.text.toString()
            )
            ReboundAPI.create().obtainToken(obtainTokenRequest)
                .enqueue(object : Callback<ObtainTokenResponse> {
                    override fun onResponse(
                        call: Call<ObtainTokenResponse>,
                        response: Response<ObtainTokenResponse>
                    ) {
                        if(response.isSuccessful){
                            Toast.makeText(
                                applicationContext,
                                "Login successful!",
                                Toast.LENGTH_LONG
                            ).show()
                            startActivity<MainActivity> {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
                                MainActivity.addExtras(this, true)
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

                    override fun onFailure(
                        call: Call<ObtainTokenResponse>,
                        t: Throwable
                    ) {
                        Toast.makeText(
                            applicationContext,
                            "Server error occurred, try again later",
                            Toast.LENGTH_LONG
                        ).show()
                    }

                })
        }
        binding.buttonSignup.setOnClickListener {
            startActivity<SignupActivity> {}
        }
        binding.tvForgotPassword.setOnClickListener {
            startActivity<ForgotPasswordActivity> {}
        }
    }

    private fun checkFields() {
        binding.buttonLogin.isEnabled = binding.etUsername.text.toString().length >= 5 && binding.etPassword.text.toString().length >= 5
    }

}