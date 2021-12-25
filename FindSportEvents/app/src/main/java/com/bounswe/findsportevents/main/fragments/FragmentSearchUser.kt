package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SearchView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapterUser
import com.bounswe.findsportevents.databinding.FragmentSearchUserBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentSearchUser : Fragment(), RecyclerAdapterUser.OnItemClickListener {
    private var _binding: FragmentSearchUserBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapterUser.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterUser.ViewHolder>?=null
    private var token = ""
    private var usernames :MutableList<String> =mutableListOf()
    private var favSports :MutableList<String> =mutableListOf()
    private var currentText = ""
    private var username=""
    private var favSport=""
    var next = false
    private lateinit var searchUserFragListener: FragmentSearchUserListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        searchUserFragListener = requireActivity() as FragmentSearchUserListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        token= "$token"
        var page=1


    }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentSearchUserBinding.inflate(inflater, container, false)
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
        binding.searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {

            override fun onQueryTextChange(newText: String): Boolean {
                currentText=binding.searchView.query.toString()
                usernames = mutableListOf()
                favSports = mutableListOf()
                layoutManager=LinearLayoutManager(context)
                binding.recyclerView2.layoutManager=layoutManager
                adapter = RecyclerAdapterUser(usernames,favSports, listener)


                binding.recyclerView2.adapter = adapter
                ReboundAPI.create().getUser(token,currentText).enqueue(object: Callback<UserResponse>{
                    override fun onResponse(
                        call: Call<UserResponse>,
                        response: Response<UserResponse>
                    ) {
                        if (response.isSuccessful) {
                            usernames.add(currentText)
                            response.body()?.fav_sport_1?.let { favSports.add(it) }
                            layoutManager=LinearLayoutManager(context)
                            binding.recyclerView2.layoutManager=layoutManager
                            adapter = RecyclerAdapterUser(usernames,favSports, listener)


                            binding.recyclerView2.adapter = adapter
                        }
                    }

                    override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                       // TODO("Not yet implemented")
                    }

                })
                return false
            }

            override fun onQueryTextSubmit(query: String): Boolean {
                // task HERE
                return false
            }

        })
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    interface FragmentSearchUserListener{
        //        TODO("Not yet implemented")
    }
    companion object {
        const val TAG = "search user"
        private const val TOKEN_KEY = "token_key"

        fun newInstance(token: String) = FragmentSearchUser().also {
            it.arguments= Bundle().also {
                it.putString(TOKEN_KEY,token)
            }
        }
    }

    override fun onItemClick(position: Int) {
        Toast.makeText(context,"Item ${usernames[position]}", Toast.LENGTH_SHORT).show()
    }


}