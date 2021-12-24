package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.databinding.FragmentViewAllEventsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import kotlin.properties.Delegates


class FragmentViewAllEvents : Fragment() {
    private var _binding: FragmentViewAllEventsBinding? = null
    private val binding get() = _binding!!
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapter.ViewHolder>?=null
    private var token = ""
    var events : MutableList<String> = mutableListOf()
    var creators:MutableList<Int> = mutableListOf()
    var fields:MutableList<String> = mutableListOf()
    var players:MutableList<Int> = mutableListOf()
    var spectators:MutableList<Int> = mutableListOf()
    var date:MutableList<String> = mutableListOf()
    var empList : MutableList<Int> = mutableListOf(0)
    var eventList = mutableListOf(2,3,4)
    var next = false
    private lateinit var viewAllEventsFragListener: FragmentViewAllEventsListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewAllEventsFragListener = requireActivity() as FragmentViewAllEventsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        token= "JWT $token"
        var page=1
            ReboundAPI.create().getEvents(token,page).enqueue(object : Callback<AllEventsResponse> {

                override fun onResponse(
                    call: Call<AllEventsResponse>,
                    response: Response<AllEventsResponse>
                ) {

                    if (response.isSuccessful) {
                        next= response.body()?.next!=null
                        for(i in 0 until response.body()?.results?.size!!){
                            response.body()?.results?.get(i)?.let { events.add(it.sport) }
                            response.body()?.results?.get(i)?.let { creators.add(it.owner) }
                            response.body()?.results?.get(i)?.let { fields.add(it.location) }
                            response.body()?.results?.get(i)
                                ?.let { players.add(it.player_capacity) }
                            response.body()?.results?.get(i)
                                ?.let { spectators.add(it.spec_capacity) }
                            response.body()?.results?.get(i)?.let { date.add(it.date.toString()) }
                        }
                        layoutManager=LinearLayoutManager(context)
                        binding.recyclerView.layoutManager=layoutManager
                        adapter = RecyclerAdapter(events,creators,fields,players,spectators,date)
                        binding.recyclerView.adapter = adapter

                        if(page*1.0 < response.body()?.count!!/10.0){
                            page++
                            ReboundAPI.create().getEvents(token,page).enqueue(object : Callback<AllEventsResponse> {

                                override fun onResponse(
                                    call: Call<AllEventsResponse>,
                                    response: Response<AllEventsResponse>
                                ) {

                                    if (response.isSuccessful) {
                                        next= response.body()?.next!=null
                                        for(i in 0 until response.body()?.results?.size!!){
                                            response.body()?.results?.get(i)?.let { events.add(it.sport) }
                                            response.body()?.results?.get(i)?.let { creators.add(it.owner) }
                                            response.body()?.results?.get(i)?.let { fields.add(it.location) }
                                            response.body()?.results?.get(i)
                                                ?.let { players.add(it.player_capacity) }
                                            response.body()?.results?.get(i)
                                                ?.let { spectators.add(it.spec_capacity) }
                                            response.body()?.results?.get(i)?.let { date.add(it.date.toString()) }
                                        }
                                        layoutManager=LinearLayoutManager(context)
                                        binding.recyclerView.layoutManager=layoutManager
                                        adapter = RecyclerAdapter(events,creators,fields,players,spectators,date)
                                        binding.recyclerView.adapter = adapter

                                    }
                                }

                                override fun onFailure(call: Call<AllEventsResponse>, t: Throwable) {
                                    //
                                }

                            }
                            )
                        }

                    }
                }

                override fun onFailure(call: Call<AllEventsResponse>, t: Throwable) {
                //
                }

            }
            )



    }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentViewAllEventsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()

    }

    private fun setObservers() {
//        TODO("Not yet implemented")
    }

    private fun setClickListeners() {
//        TODO("Not yet implemented")
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    interface FragmentViewAllEventsListener{
        //        TODO("Not yet implemented")
    }
    companion object {
        const val TAG = "view all events"
        private const val TOKEN_KEY = "token_key"

        fun newInstance(token: String) = FragmentViewAllEvents().also {
            it.arguments=Bundle().also {
                it.putString(TOKEN_KEY,token)
            }
        }
    }


}