package com.bounswe.findsportevents.main.fragments

import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.adapter.RecyclerAdapter2
import com.bounswe.findsportevents.databinding.FragmentSearchResultsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.SearchEventRequest
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

class FragmentSearchResults : Fragment() {
    private var _binding: FragmentSearchResultsBinding? = null
    private val binding get() = _binding!!
    private var token = ""
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapter2.ViewHolder>?=null
    private var sports = mutableListOf(0)
    private var testList= arrayListOf("")
    private var sport =""
    private var minAge = 0
    private var maxAge = 0
    private var minSkillLevel = 0
    private var maxSkillLevel = 0
    private var minLongitude=0f
    private var maxLongitude=0f
    private var minLatitude=0f
    private var maxLatitude=0f
    private  var startTime=""
    private var endTime = ""
    private var minDuration =0
    private var maxDuration =0
    var events : MutableList<String> = mutableListOf()
    var creators:MutableList<Int> = mutableListOf()
    var fields:MutableList<String> = mutableListOf()
    var players:MutableList<Int> = mutableListOf()
    var spectators:MutableList<Int> = mutableListOf()
    var date:MutableList<String> = mutableListOf()
    var empList : MutableList<Int> = mutableListOf(0)
    var eventList = mutableListOf(2,3,4)
    private lateinit var searchResultsFragListener : FragmentSearchResultsListener

    interface FragmentSearchResultsListener {

    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        searchResultsFragListener = requireActivity() as FragmentSearchResultsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        sport=requireArguments().getString(SPORT_KEY)?:""
        minAge= requireArguments().getInt(MIN_AGE_KEY)
        maxAge= requireArguments().getInt(MAX_AGE_KEY)
        minSkillLevel=requireArguments().getInt(MIN_SKILL_KEY)
        maxSkillLevel=requireArguments().getInt(MAX_SKILL_KEY)
        minDuration=requireArguments().getInt(MIN_DURATION_KEY)
        maxDuration=requireArguments().getInt(MAX_DURATION_KEY)
        startTime= requireArguments().getString(START_TIME_KEY)?:""
        endTime= requireArguments().getString(END_TIME_KEY)?: ""
        minLatitude=requireArguments().getFloat(MIN_LATITUDE_KEY)
        maxLatitude=requireArguments().getFloat(MAX_LATITUDE_KEY)
        minLongitude=requireArguments().getFloat(MIN_LONGITUDE_KEY)
        maxLongitude=requireArguments().getFloat(MAX_LONGITUDE_KEY)
        token= "$token"

        val searchEventRequest= SearchEventRequest(
            sport,minSkillLevel,maxSkillLevel,minAge,maxAge,minDuration,maxDuration,startTime,endTime,
            minLatitude,maxLatitude,minLongitude,maxLongitude
        )
        ReboundAPI.create().searchEvents(token,searchEventRequest).enqueue(object : Callback<AllEventsResponse> {

            override fun onResponse(
                call: Call<AllEventsResponse>,
                response: Response<AllEventsResponse>
            ) {

                if (response.isSuccessful) {

                    response.body()?.results?.get(0)?.let { events.add(it.sport) }
                    response.body()?.results?.get(0)?.let { creators.add(it.owner) }
                    response.body()?.results?.get(0)?.let { fields.add(it.location) }
                    response.body()?.results?.get(0)?.let { players.add(it.player_capacity) }
                    response.body()?.results?.get(0)?.let { spectators.add(it.spec_capacity) }
                    response.body()?.results?.get(0)?.let { date.add(it.date.toString()) }
                    layoutManager= LinearLayoutManager(context)
                    binding.recyclerView2.layoutManager=layoutManager
                    adapter = RecyclerAdapter2(events,creators,fields,players,spectators,date)
                    binding.recyclerView2.adapter = adapter

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

        _binding = FragmentSearchResultsBinding.inflate(inflater, container, false)
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


    companion object {
        const val TAG = "view all events"
        private const val TOKEN_KEY = "token_key"
        private const val SPORT_KEY = "sport_key"
        private const val MIN_SKILL_KEY = "min_skill_key"
        private const val MAX_SKILL_KEY = "max_skill_key"
        private const val MIN_AGE_KEY = "min_age_key"
        private const val MAX_AGE_KEY = "max_age_key"
        private const val START_TIME_KEY = "start_time_key"
        private const val END_TIME_KEY = "end_time_key"
        private const val MIN_DURATION_KEY = "min_duration_key"
        private const val MAX_DURATION_KEY = "max_duration_key"
        private const val MIN_LATITUDE_KEY = "min_latitude_key"
        private const val MIN_LONGITUDE_KEY = "min_longitude_key"
        private const val MAX_LATITUDE_KEY = "max_latitude_key"
        private const val MAX_LONGITUDE_KEY = "max_longitude_key"


        fun newInstance(token : String,sport: String, minSkill:Int,maxSkill:Int, min_age:Int, max_age:Int,start_time:String,end_time:String,min_duration:Int,max_duration:Int,min_latitude:Float,
        max_latitude:Float,min_longitude:Float,max_longitude:Float) = FragmentSearchResults().apply {
            arguments = Bundle().apply {
                putString(TOKEN_KEY, token)
                putString(SPORT_KEY, sport)
                putInt(MIN_SKILL_KEY, minSkill)
                putInt(MAX_SKILL_KEY, maxSkill)
                putInt(MIN_AGE_KEY, min_age)
                putInt(MAX_AGE_KEY, max_age)
                putString(START_TIME_KEY, start_time)
                putString(END_TIME_KEY, end_time)
                putInt(MIN_DURATION_KEY, min_duration)
                putInt(MAX_DURATION_KEY, max_duration)
                putFloat(MIN_LATITUDE_KEY, min_latitude)
                putFloat(MAX_LATITUDE_KEY, max_latitude)
                putFloat(MIN_LONGITUDE_KEY, min_longitude)
                putFloat(MAX_LONGITUDE_KEY, max_longitude)


            }
        }
    }


}