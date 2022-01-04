package com.bounswe.findsportevents.main

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.ActivityMainBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.login.LoginActivity
import com.bounswe.findsportevents.main.fragments.*
import com.bounswe.findsportevents.network.DecathlonAPI
import com.bounswe.findsportevents.network.modalz.responses.GetSportsResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity(),FragmentMapLocation.FragmentMapLocationListener,FragmentSpectators.FragmentSpectatorsListener,FragmentPlayers.FragmentPlayersListener,FragmentFollowing.FragmentFollowingListener,FragmentPlayedEvents.FragmentPlayedEventsListener,FragmentAnswersEquipment.FragmentAnswersEquipmentListener,FragmentAnswers.FragmentAnswersListener,FragmentCreateEquipment.FragmentCreateEquipmentListener,FragmentUserResult.FragmentUserResultListener,FragmentEquipmentResults.FragmentEquipmentResultsListener,FragmentEquipmentDetailed.FragmentEquipmentDetailedListener, FragmentCreateEvent.FragmentCreateEventListener,FragmentSearchUser.FragmentSearchUserListener,FragmentSearchTransit.FragmentSearchTransitListener,FragmentMyEvents.FragmentMyEventsListener,FragmentViewAllEvents.FragmentViewAllEventsListener,FragmentMap.FragmentMapListener,FragmentSearchEvent.FragmentSearchEventListener, FragmentProfile.FragmentProfileListener,FragmentSearchResults.FragmentSearchResultsListener,FragmentViewEventDetailed.FragmentViewEventDetailedListener {

    private lateinit var binding: ActivityMainBinding

    private var login = false
    private var token = ""
    private var username = ""
    private var testList= arrayListOf("f1","Football","Sumo Wrestling")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

            DecathlonAPI.create().getSports().enqueue(object: Callback<GetSportsResponse> {
                override fun onResponse(call: Call<GetSportsResponse>, response: Response<GetSportsResponse>){
                    if(response.isSuccessful){
                        response.body()?.data?.let { testList.ensureCapacity(it.size) }
                        for(item in response.body()?.data!!){
                        testList.add(item.attributes.name)
                        }
                        }
                    }

                override fun onFailure(call: Call<GetSportsResponse>, t: Throwable) {
            //        TODO("Not yet implemented")
                }
            }


            )



        if (intent.extras != null) {
            login = intent.extras!!.getBoolean(LOGIN_KEY)
            token = intent.extras!!.getString(TOKEN_KEY) ?: ""
            username = intent.extras!!.getString(USERNAME_KEY) ?: ""
        }

        if (savedInstanceState == null && supportFragmentManager.findFragmentById(binding.containerMain.id) == null) {
            supportFragmentManager.beginTransaction()
                .add(binding.containerMain.id, FragmentViewAllEvents.newInstance(token,username), FragmentViewAllEvents.TAG).commit()
        }

        binding.bottomNav.apply {
            setOnItemSelectedListener {
                when (it.itemId) {
                    R.id.bottom_home -> {
                        displayViewAllEventsFragment(token,username)
                        false
                    }
                    R.id.bottom_profile -> {
                        displayProfileFragment(token,username,testList)
                        false
                    }
                    R.id.bottom_event -> {
                        displayHomeFragment(token, testList)
                        false
                    }
                    R.id.bottom_search -> {
                        displaySearchTransitFragment(token,username,testList)
                        false
                    }
                    else -> false
                }

            }
        }
        initListeners()
        setObservers()
    }
    private fun displaySearchTransitFragment(token: String,username:String,testList: ArrayList<String>){
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentSearchTransit.newInstance(token,username,testList), FragmentSearchTransit.TAG).commit()
    }
    private fun displaySearchEventFragment(token: String,username:String,testList: ArrayList<String>){
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentSearchEvent.newInstance(token,username,testList), FragmentSearchEvent.TAG).commit()
    }
    private fun displayViewAllEventsFragment(token: String,username:String){
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentViewAllEvents.newInstance(token,username), FragmentViewAllEvents.TAG).commit()
    }
    private fun displayHomeFragment(token: String, testList: ArrayList<String>) {
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentCreateEvent.newInstance(token, username, testList), FragmentCreateEvent.TAG).commit()
    }

    private fun displayProfileFragment(token: String, username: String,testList: ArrayList<String>) {
        supportFragmentManager.beginTransaction().replace(binding.containerMain.id, FragmentProfile.newInstance(token, username,testList), FragmentProfile.TAG).commit()
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