package com.bounswe.findsportevents.login

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextUtils
import android.text.TextWatcher
import android.util.Patterns
import android.view.View
import android.widget.CheckBox
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.findsportevents.databinding.ActivitySignupBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.SignupRequest
import com.bounswe.findsportevents.network.modalz.responses.SignupResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SignupActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignupBinding
    private var cbChecked: Boolean = false
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)
        initListeners()
    }

    private fun initListeners() {
        binding.etUsername.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etPassword.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etPasswordConfirm.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })


        binding.etMail.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.buttonSignup.setOnClickListener {

            val signupRequest = SignupRequest(
                binding.etUsername.text.toString(),
                binding.etMail.text.toString(), binding.etPassword.text.toString()
            )

            ReboundAPI.create().createUser(signupRequest)
                .enqueue(object : Callback<SignupResponse> {
                    override fun onResponse(
                        call: Call<SignupResponse>,
                        response: Response<SignupResponse>
                    ) {

                        if (response.isSuccessful) {
                            Toast.makeText(
                                applicationContext,
                                "Signup successful!",
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

                    override fun onFailure(call: Call<SignupResponse>, t: Throwable) {
                        Toast.makeText(
                            applicationContext,
                            "Server error occurred, try again later",
                            Toast.LENGTH_LONG
                        ).show()
                    }

                })


        }


    }

    fun onCheckboxClicked(view: View) {
        if (view is CheckBox) {
            val checked: Boolean = view.isChecked

            when (view.id) {
                binding.cbTerms.id -> {
                    cbChecked = checked
                    checkFields()
                }
            }
        }

    }

    private fun checkFields() {
        binding.buttonSignup.isEnabled =
            binding.etUsername.text.toString().length >= 5 && binding.etPassword.text.toString().length >= 5
                    && binding.etPasswordConfirm.text.toString() == binding.etPassword.text.toString()
                    && isValidEmail(binding.etMail.text.toString()) && cbChecked
    }

    private fun isValidEmail(email: String): Boolean {
        return !TextUtils.isEmpty(email) && Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }

}