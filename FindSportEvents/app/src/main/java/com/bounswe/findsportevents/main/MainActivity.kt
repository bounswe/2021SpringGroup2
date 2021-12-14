package com.bounswe.findsportevents.main

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.ActivityMainBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.login.LoginActivity
import com.bounswe.findsportevents.main.fragments.*

class MainActivity : AppCompatActivity(), FragmentCreateEvent.FragmentHomeListener,FragmentMap.FragmentMapListener,FragmentSearchEvent.FragmentSearchEventListener, FragmentProfile.FragmentProfileListener,FragmentViewAllEvents.FragmentViewAllEventsListener {

    private lateinit var binding: ActivityMainBinding

    private var login = false
    private var token = ""
    private var username = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)


        if (intent.extras != null) {
            login = intent.extras!!.getBoolean(LOGIN_KEY)
            token = intent.extras!!.getString(TOKEN_KEY) ?: ""
            username = intent.extras!!.getString(USERNAME_KEY) ?: ""
        }

        if (savedInstanceState == null && supportFragmentManager.findFragmentById(binding.containerMain.id) == null) {
            supportFragmentManager.beginTransaction()
                .add(binding.containerMain.id, FragmentViewAllEvents.newInstance(token), FragmentViewAllEvents.TAG).commit()
        }

        binding.bottomNav.apply {
            setOnItemSelectedListener {
                when (it.itemId) {
                    R.id.bottom_home -> {
                        displayHomeFragment(token)
                        false
                    }
                    R.id.bottom_profile -> {
                        displayProfileFragment(token,username)
                        false
                    }
                    R.id.bottom_event -> {
                        displayViewAllEventsFragment(token)
                        false
                    }
                    R.id.bottom_search -> {
                        displaySearchEventFragment(token)
                        false
                    }
                    else -> false
                }

            }
        }
        initListeners()
        setObservers()
    }
    private fun displaySearchEventFragment(token: String){
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentSearchEvent.newInstance(token), FragmentSearchEvent.TAG).commit()
    }
    private fun displayViewAllEventsFragment(token: String){
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentViewAllEvents.newInstance(token), FragmentViewAllEvents.TAG).commit()
    }
    private fun displayHomeFragment(token: String) {
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentCreateEvent.newInstance(token), FragmentCreateEvent.TAG).commit()
    }

    private fun displayProfileFragment(token: String, username: String) {
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentProfile.newInstance(token, username), FragmentProfile.TAG).commit()
    }

    private fun setObservers() {
        //TODO FOR AUTOLOGIN: auth observer is gonna be implemented
        //mainViewModel.authError.observe()
        if (!login) {
            startActivity<LoginActivity> {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
            }
        }
    }
    private fun initListeners(){
       //
    }

    companion object {

        private const val LOGIN_KEY = "login_key"
        private const val TOKEN_KEY = "token_key"
        private const val USERNAME_KEY = "username_key"

        fun addExtras(intent: Intent, login: Boolean, token: String, username:String) {
            intent.putExtra(LOGIN_KEY, login)
            intent.putExtra(TOKEN_KEY, token)
            intent.putExtra(USERNAME_KEY, username)
        }
    }
}