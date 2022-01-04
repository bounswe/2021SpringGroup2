package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapterUser
import com.bounswe.findsportevents.databinding.FragmentPlayersBinding
import com.bounswe.findsportevents.databinding.FragmentSpectatorsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentSpectators : Fragment(), RecyclerAdapterUser.OnItemClickListener {
    private var _binding: FragmentSpectatorsBinding? = null
    private val binding get() = _binding!!
    private var listener: RecyclerAdapterUser.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager? = null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterUser.ViewHolder>? = null
    private var token = ""
    private var players = arrayListOf<Int>()
    private var usernames: MutableList<String> = mutableListOf()
    private var favSports: MutableList<String> = mutableListOf()
    private var currentText = ""
    private var username = ""
    private var selectedUsername = ""
    private var favSport = ""
    var next = false
    private lateinit var spectatorsFragListener: FragmentSpectatorsListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        spectatorsFragListener = requireActivity() as FragmentSpectatorsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USER_KEY) ?: ""
        players = requireArguments().getIntegerArrayList(PLAYER_KEY) ?: arrayListOf()
        for(i in 0 until players.size){
            ReboundAPI.create().getUser(token,players[i].toString()).enqueue(object :
                Callback<UserResponse> {
                override fun onResponse(
                    call: Call<UserResponse>,
                    response: Response<UserResponse>
                ) {
                    if (response.isSuccessful){
                        usernames.add(response.body()!!.username)
                        favSports.add(response.body()!!.fav_sport_1.toString())
                        layoutManager= LinearLayoutManager(context)
                        binding.recyclerView.layoutManager=layoutManager
                        adapter = RecyclerAdapterUser(usernames,favSports, listener)
                        binding.recyclerView.adapter = adapter
                    }

                }

                override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                    //
                }


            })
        }

        token = "$token"
        var page = 1



    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentSpectatorsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()
        initListeners()

    }

    private fun setObservers() {
//        TODO("Not yet implemented")
    }

    private fun setClickListeners() {
//        TODO("Not yet implemented")
    }

    private fun initListeners() {
        //
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    interface FragmentSpectatorsListener {
        //        TODO("Not yet implemented")
    }

    companion object {
        const val TAG = "search user"
        private const val TOKEN_KEY = "token_key"
        private const val USER_KEY = "user_key"
        private const val PLAYER_KEY = "player_key"


        fun newInstance(token: String, username: String, players : ArrayList<Int>) = FragmentSpectators().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putString(USER_KEY, username)
                it.putIntegerArrayList(PLAYER_KEY,players)
            }
        }
    }

    override fun onItemClick(position: Int) {
        selectedUsername = currentText
        val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
        transaction.replace(
            R.id.container_main,
            FragmentUserResult.newInstance(token, username, usernames[position])
        ).addToBackStack("userResult")
        transaction.commit()
    }
}