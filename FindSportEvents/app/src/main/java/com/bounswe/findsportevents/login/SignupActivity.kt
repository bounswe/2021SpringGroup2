package com.bounswe.findsportevents.login

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.findsportevents.databinding.ActivitySignupBinding

class SignupActivity: AppCompatActivity() {
    private lateinit var binding: ActivitySignupBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

}