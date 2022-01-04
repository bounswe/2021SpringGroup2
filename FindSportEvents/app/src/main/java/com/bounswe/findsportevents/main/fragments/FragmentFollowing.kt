package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SearchView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapterUser
import com.bounswe.findsportevents.databinding.FragmentFollowingBinding
import com.bounswe.findsportevents.databinding.FragmentSearchUserBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllUserResponse
import com.bounswe.findsportevents.network.modalz.responses.GetFollowingsResponse
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentFollowing : Fragment(), RecyclerAdapterUser.OnItemClickListener {
    private var _binding: FragmentFollowingBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapterUser.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterUser.ViewHolder>?=null
    private var token = ""
    private var usernames :MutableList<String> =mutableListOf()
    private var favSports :MutableList<String> =mutableListOf()
    private var currentText = ""
    private var username=""
    private var selectedUsername=""
    private var favSport=""
    var next = false
    private lateinit var followingFragListener: FragmentFollowingListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        followingFragListener = requireActivity() as FragmentFollowingListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USER_KEY) ?: ""

        token= "$token"
        var page=1
        ReboundAPI.create().getFollowings(token,username).enqueue(object: Callback<GetFollowingsResponse>{
            override fun onResponse(
                call: Call<GetFollowingsResponse>,
                response: Response<GetFollowingsResponse>
            ) {
                if (response.isSuccessful){
                    for(i in 0 until (response.body()?.items?.size ?: 0)){
                        usernames.add(response.body()?.items?.get(i)?.`object`!!.identifier)
                        ReboundAPI.create().getUser(token,response.body()?.items?.get(i)?.`object`!!.identifier).enqueue(object:Callback<UserResponse>{
                            override fun onResponse(
                                call: Call<UserResponse>,
                                response: Response<UserResponse>
                            ) {
                                if (response.isSuccessful){
                                    favSports.add(response.body()?.fav_sport_1.toString())
                                    layoutManager=LinearLayoutManager(context)
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
                }
            }

            override fun onFailure(call: Call<GetFollowingsResponse>, t: Throwable) {
                //
            }

        })


    }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentFollowingBinding.inflate(inflater, container, false)
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
    private fun initListeners(){
        //
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    interface FragmentFollowingListener{
        //        TODO("Not yet implemented")
    }
    companion object {
        const val TAG = "search user"
        private const val TOKEN_KEY = "token_key"
        private const val USER_KEY = "user_key"

        fun newInstance(token: String,username : String) = FragmentFollowing().also {
            it.arguments= Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putString(USER_KEY,username)
            }
        }
    }

    override fun onItemClick(position: Int) {
        selectedUsername=currentText
        val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
        transaction.replace(R.id.container_main,FragmentUserResult.newInstance(token,username,usernames[position])).addToBackStack("userResult")
        transaction.commit()
    }


}