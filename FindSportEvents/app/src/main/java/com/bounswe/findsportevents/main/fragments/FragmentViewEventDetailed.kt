package com.bounswe.findsportevents.main.fragments

import android.media.metrics.Event
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentViewEventDetailedBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentViewEventDetailed : Fragment() {

    private var _binding: FragmentViewEventDetailedBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewEventDetailedFragListener: FragmentViewEventDetailedListener
    private var token = ""
    private var eventId = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewEventDetailedFragListener = requireActivity() as FragmentViewEventDetailedListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        eventId = requireArguments().getInt(EVENT_KEY) ?: 0
        ReboundAPI.create().getEventbyId(token,eventId).enqueue(object : Callback<EventbyIdResponse>{
            override fun onResponse(call: Call<EventbyIdResponse>, response: Response<EventbyIdResponse>) {
                if (response.isSuccessful) {
                    binding.tvEventTitleResult.text = response.body()?.`object`?.title ?: ""
                    binding.tvEventLocationResult.text = response.body()?.`object`?.content ?:""
                    binding.tvDateResult.text = response.body()?.`object`?.title


                }
            }

            override fun onFailure(call: Call<EventbyIdResponse>, t: Throwable) {
                //TODO("Not yet implemented")
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
             setClickListeners()
               setObservers()
    }

    private fun setObservers() {
  //      TODO("Not yet implemented")
    }

    private fun setClickListeners() {
//        TODO("Not yet implemented")
    }

    interface FragmentViewEventDetailedListener{
        //        TODO("Not yet implemented")
    }




    companion object {
        val TAG = "FragmentViewEventDetailed"
        private const val TOKEN_KEY = "token_key"
        private const val EVENT_KEY = "event_key"
        fun newInstance(token: String,eventId: Int) = FragmentViewEventDetailed().also {
            it.arguments=Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putInt(EVENT_KEY,eventId)
            }
        }

    }
}