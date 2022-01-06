package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.databinding.FragmentPlayedEventsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.network.modalz.responses.EventbyIdResponse
import com.bounswe.findsportevents.network.modalz.responses.PlayedEventsResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception

class FragmentPlayedEvents : Fragment(), RecyclerAdapter.OnItemClickListener , DialogManager {
    private var _binding: FragmentPlayedEventsBinding? = null
    private val binding get() = _binding!!
    private var listener: RecyclerAdapter.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager? = null
    private var adapter: RecyclerView.Adapter<RecyclerAdapter.ViewHolder>? = null
    private var token = ""
    private var username= ""
    private var dialog: LoadingDialog? = null
    var ownerId : Long=0
    var eventIds : MutableList<Int> = mutableListOf()
    var contents: MutableList<String> = mutableListOf()
    var titles: MutableList<String> = mutableListOf()
    var events: MutableList<String> = mutableListOf()
    var creators: MutableList<Int> = mutableListOf()
    var fields: MutableList<String> = mutableListOf()
    var players: MutableList<Int> = mutableListOf()
    var spectators: MutableList<Int> = mutableListOf()
    var date: MutableList<String> = mutableListOf()
    var empList: MutableList<Int> = mutableListOf(0)
    var eventList = mutableListOf(2, 3, 4)
    var next = false
    private lateinit var playedEventsFragListener: FragmentPlayedEventsListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        playedEventsFragListener = requireActivity() as FragmentPlayedEventsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        ownerId = requireArguments().getLong(OWNER_KEY) ?: 0
        token = "$token"
        var page = 1
        context?.run {
            showLoading(this)
        }
        ReboundAPI.create().getPlayedEvents(token,ownerId.toInt()).enqueue(object : Callback<PlayedEventsResponse>{
            override fun onResponse(
                call: Call<PlayedEventsResponse>,
                response: Response<PlayedEventsResponse>
            ) {
                if(response.isSuccessful){
                    for(i in 0 until (response.body()?.count ?: 0)){
                        response.body()?.results?.get(i)?.let {
                            ReboundAPI.create().getEventbyId(token,
                                it.id
                            ).enqueue(object : Callback <EventbyIdResponse>{
                                override fun onResponse(
                                    call: Call<EventbyIdResponse>,
                                    response: Response<EventbyIdResponse>
                                ) {
                                    response.body()?.`object`?.let { it1 -> events.add(it1.eventSport) }
                                    response.body()?.`object`?.let { it1 -> creators.add(it1.ownerId) }
                                    response.body()?.`object`?.location?.let { it1 -> fields.add(it1.name) }
                                    response.body()?.`object`?.let { it1 -> players.add(it1.eventPlayerCapacity) }
                                    response.body()?.`object`?.let { it1 -> spectators.add(it1.eventSpectatorCapacity) }
                                    response.body()?.`object`?.let { it1 -> date.add(it1.eventDate.toString()) }
                                    response.body()?.`object`?.let { it1 -> eventIds.add(it1.postId) }
                                    layoutManager = LinearLayoutManager(context)
                                    binding.recyclerViewEvents.layoutManager = layoutManager
                                    adapter = RecyclerAdapter(
                                        events,
                                        creators,
                                        fields,
                                        players,
                                        spectators,
                                        date,
                                        listener
                                    )


                                    binding.recyclerViewEvents.adapter = adapter

                                }

                                override fun onFailure(
                                    call: Call<EventbyIdResponse>,
                                    t: Throwable
                                ) {
                                  //
                                }

                            })
                        }
                    }
                    hideLoading()

                }
            }

            override fun onFailure(call: Call<PlayedEventsResponse>, t: Throwable) {
               //
            }

        })


    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentPlayedEventsBinding.inflate(inflater, container, false)
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

    interface FragmentPlayedEventsListener {
        //        TODO("Not yet implemented")
    }

    companion object {
        const val TAG = "view all events"
        private const val TOKEN_KEY = "token_key"
        private const val OWNER_KEY = "owner_key"

        fun newInstance(token: String, owner : Long) = FragmentPlayedEvents().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putLong(OWNER_KEY, owner)
            }
        }
    }

    override fun onItemClick(position: Int) {
        val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
        transaction.replace(R.id.container_main,FragmentViewEventDetailed.newInstance(token,ownerId.toString(),eventIds[position])).addToBackStack("eqiupmentresult")
        transaction.commit()
    }
    override fun showLoading(context: Context) {
        try {
            hideLoading()
            dialog = LoadingDialog(context)
            dialog?.setCancelable(false)
            dialog?.show()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun hideLoading() {
        try {
            dialog?.dismiss()
            dialog = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}