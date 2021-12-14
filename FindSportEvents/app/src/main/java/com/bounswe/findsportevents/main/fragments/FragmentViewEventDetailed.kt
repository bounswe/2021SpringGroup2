package com.bounswe.findsportevents.main.fragments

import android.media.metrics.Event
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentViewEventDetailedBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.ActorResponse
import com.bounswe.findsportevents.network.modalz.responses.EventResponse
import com.bounswe.findsportevents.network.modalz.responses.LocationResponse
import com.bounswe.findsportevents.network.modalz.responses.ObjectResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentViewEventDetailed(val token: String, val eventId: Int) : Fragment() {

    private var _binding: FragmentViewEventDetailedBinding? = null
    private val binding get() = _binding!!
    private var data= EventResponse(
    "a", ActorResponse("b", "odun"), ObjectResponse(
    "c",
    "name",
    1,
    2,
    "affafa",
    "kals",
    "1.1.1",
    "2.2.2",
    8,
    LocationResponse("qwert", "d", 3f, 5f, 6f, "km/sarac"),
    "3.3.3",
    "es",
    13,
    31,
    22,
    44,
    56,
    65,
    listOf(1, 2, 3),
    listOf(4, 5, 6)
    )
    )
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ReboundAPI.create().getEventbyId(token, eventId).enqueue(object : Callback<EventResponse> {
            override fun onResponse(call: Call<EventResponse>, response: Response<EventResponse>) {
                if (response.isSuccessful) {
                    response.body()?.let {
                        data = it
                        initializeViews()
                    }
                }
            }

            override fun onFailure(call: Call<EventResponse>, t: Throwable) {

            }

        })

    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentViewEventDetailedBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initializeViews()
    }

    private fun initializeViews() {
        binding.tvEventTitleResult.text = data.`object`.title
        binding.apply {
            data.`object`.let {
                tvEventTitleResult.text = it.title
                tvEventTypeResult.text = it.type
                tvEventLocationResult.text = it.location.name
                tvDateResult.text = it.eventDate
                tvAgeIntervalResult.text = it.eventMinAge.toString()+"-"+it.eventMaxAge.toString()
                tvPlayersResult.text = it.eventPlayers.toString()
                tvSpectatorsResult.text = it.eventSpectatorCapacity.toString()
            }
        }
    }



    companion object {
        val TAG = "FragmentViewEventDetailed"
        fun newInstance(token: String, eventId: Int) = FragmentViewEventDetailed(token, eventId)
    }
}