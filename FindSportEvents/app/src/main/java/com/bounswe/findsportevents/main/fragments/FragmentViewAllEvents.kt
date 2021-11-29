package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.databinding.FragmentViewAllEventsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.network.modalz.responses.EventResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class FragmentViewAllEvents : Fragment() {
    private var _binding: FragmentViewAllEventsBinding? = null
    private val binding get() = _binding!!
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapter.ViewHolder>?=null
    private var token = ""
    var events = mutableListOf("")
    var creators = mutableListOf("")
    var fields= mutableListOf("")
    var players= mutableListOf(listOf(0))
    var spectators= mutableListOf(0)
    var date= mutableListOf("")
    var empList : MutableList<Int> = mutableListOf(0)
    var eventList = listOf(0)
    private lateinit var viewAllEventsFragListener: FragmentViewAllEventsListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewAllEventsFragListener = requireActivity() as FragmentViewAllEventsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        ReboundAPI.create().getEvents(token).enqueue(object : Callback<AllEventsResponse> {
            override fun onResponse(
                call: Call<AllEventsResponse>,
                response: Response<AllEventsResponse>
            ) {
                if (response.isSuccessful) {
                    eventList = response.body()?.ids ?: listOf()
                }
            }

            override fun onFailure(call: Call<AllEventsResponse>, t: Throwable) {
//                TODO("Not yet implemented")
            }
        })
        if(eventList.isNotEmpty()){
        for(item in eventList){
            ReboundAPI.create().getEventbyId(token,item).enqueue(object : Callback<EventResponse> {
                override fun onResponse(
                    call: Call<EventResponse>,
                    response: Response<EventResponse>
                ) {
                    if (response.isSuccessful) {
                        events.add(response.body()?.Object?.eventSport ?: "")
                        creators.add(response.body()?.actor?.name?: "")
                        fields.add(response.body()?.Object?.location?.name?: "")
                        players.add(response.body()?.Object?.eventPlayers?: empList)
                        spectators.add(response.body()?.Object?.eventSpectatorCapacity?: 0)
                        date.add(response.body()?.Object?.eventDate?:"")
                    }
                }

                override fun onFailure(call: Call<EventResponse>, t: Throwable) {
//                TODO("Not yet implemented")
                }
            })
        }}

    }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentViewAllEventsBinding.inflate(inflater, container, false)
        layoutManager=LinearLayoutManager(context)
        binding.recyclerView.layoutManager=layoutManager
        adapter = RecyclerAdapter(events,creators,fields,players,spectators,date)
        binding.recyclerView.adapter = adapter
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

        fun newInstance(token:String) = FragmentViewAllEvents().also {
            it.arguments=Bundle().also {
                it.putString(TOKEN_KEY,token)
            }
        }
    }


}