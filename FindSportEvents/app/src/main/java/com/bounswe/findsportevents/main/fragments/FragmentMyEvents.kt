package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.adapter.RecyclerAdapterBadges
import com.bounswe.findsportevents.databinding.FragmentMyEventsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception

class FragmentMyEvents : Fragment(), RecyclerAdapterBadges.OnItemClickListener , DialogManager{
    private var _binding: FragmentMyEventsBinding? = null
    private val binding get() = _binding!!
    private var listener: RecyclerAdapterBadges.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager? = null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterBadges.ViewHolder>? = null
    private var token = ""
    private var dialog: LoadingDialog? = null
    var ownerId : Long=0
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
    private lateinit var myEventsFragListener: FragmentMyEventsListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        myEventsFragListener = requireActivity() as FragmentMyEventsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        ownerId = requireArguments().getLong(OWNER_KEY) ?: 0
        token = "$token"
        var page = 1
        context?.run {
            showLoading(this)
        }
        ReboundAPI.create().myEvents(token, page, ownerId).enqueue(object : Callback<AllEventsResponse> {

            override fun onResponse(
                call: Call<AllEventsResponse>,
                response: Response<AllEventsResponse>
            ) {

                if (response.isSuccessful) {
                    next = response.body()?.next != null
                    for (i in 0 until response.body()?.results?.size!!) {
                        response.body()?.results?.get(i)?.let { events.add(it.sport) }
                        response.body()?.results?.get(i)?.let { creators.add(it.owner) }
                        response.body()?.results?.get(i)?.let { fields.add(it.location) }
                        response.body()?.results?.get(i)
                            ?.let { players.add(it.player_capacity) }
                        response.body()?.results?.get(i)
                            ?.let { spectators.add(it.spec_capacity) }
                        response.body()?.results?.get(i)?.let { date.add(it.date.toString()) }
                    }
                    layoutManager = LinearLayoutManager(context)
                    binding.recyclerView.layoutManager = layoutManager
                    adapter = RecyclerAdapterBadges(
                        events,
                        creators,
                        fields,
                        players,
                        spectators,
                        date,
                        listener
                    )


                    binding.recyclerView.adapter = adapter

                    if (page * 1.0 < response.body()?.count!! / 10.0) {
                        page++
                        ReboundAPI.create().myEvents(token, page, ownerId).enqueue(object :
                            Callback<AllEventsResponse> {

                            override fun onResponse(
                                call: Call<AllEventsResponse>,
                                response: Response<AllEventsResponse>
                            ) {

                                if (response.isSuccessful) {
                                    next = response.body()?.next != null
                                    for (i in 0 until response.body()?.results?.size!!) {
                                        response.body()?.results?.get(i)
                                            ?.let { events.add(it.sport) }
                                        response.body()?.results?.get(i)
                                            ?.let { creators.add(it.owner) }
                                        response.body()?.results?.get(i)
                                            ?.let { fields.add(it.location) }
                                        response.body()?.results?.get(i)
                                            ?.let { players.add(it.player_capacity) }
                                        response.body()?.results?.get(i)
                                            ?.let { spectators.add(it.spec_capacity) }
                                        response.body()?.results?.get(i)
                                            ?.let { date.add(it.date.toString()) }
                                    }
                                    layoutManager = LinearLayoutManager(context)
                                    binding.recyclerView.layoutManager = layoutManager
                                    adapter = RecyclerAdapterBadges(
                                        events,
                                        creators,
                                        fields,
                                        players,
                                        spectators,
                                        date,
                                        listener
                                    )
                                    binding.recyclerView.adapter = adapter

                                }
                            }

                            override fun onFailure(call: Call<AllEventsResponse>, t: Throwable) {
                               //
                            }

                        }
                        )
                    }
                    else{
                        hideLoading()
                    }

                }
            }

            override fun onFailure(call: Call<AllEventsResponse>, t: Throwable) {
                hideLoading()
            }

        }
        )


    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentMyEventsBinding.inflate(inflater, container, false)
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

    interface FragmentMyEventsListener {
        //        TODO("Not yet implemented")
    }

    companion object {
        const val TAG = "view all events"
        private const val TOKEN_KEY = "token_key"
        private const val OWNER_KEY = "owner_key"

        fun newInstance(token: String, owner : Long) = FragmentMyEvents().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putLong(OWNER_KEY, owner)
            }
        }
    }

    override fun onItemClick() {
//        Toast.makeText(context, "Give a badge clicked", Toast.LENGTH_SHORT).show()

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