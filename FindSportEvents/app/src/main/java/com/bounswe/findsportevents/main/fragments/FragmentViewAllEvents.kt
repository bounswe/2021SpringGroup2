package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.databinding.FragmentViewAllEventsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import kotlin.properties.Delegates


class FragmentViewAllEvents : Fragment(), RecyclerAdapter.OnItemClickListener, DialogManager {
    private var _binding: FragmentViewAllEventsBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapter.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapter.ViewHolder>?=null
    private var token = ""
    private var username = ""
    private var dialog: LoadingDialog? = null
    var contents : MutableList<String> = mutableListOf()
    var titles : MutableList<String> = mutableListOf()
    var eventIds: MutableList<Int> = mutableListOf()
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
        username = requireArguments().getString(USER_KEY) ?: ""
        token= "JWT $token"
        var page=1
        context?.run {
            showLoading(this)
        }
            ReboundAPI.create().getEvents(token,page).enqueue(object : Callback<AllEventsResponse> {

                override fun onResponse(
                    call: Call<AllEventsResponse>,
                    response: Response<AllEventsResponse>
                ) {
                    hideLoading()
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
                            eventIds.add(response.body()!!.results.get(i).id)
                        }
                        layoutManager=LinearLayoutManager(context)
                        binding.recyclerView.layoutManager=layoutManager
                        adapter = RecyclerAdapter(events,creators,fields,players,spectators,date, listener)


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
                                            eventIds.add(response.body()!!.results.get(i).id)
                                        }
                                        layoutManager=LinearLayoutManager(context)
                                        binding.recyclerView.layoutManager=layoutManager
                                        adapter = RecyclerAdapter(events,creators,fields,players,spectators,date,listener)
                                        binding.recyclerView.adapter = adapter

                                    }
                                }

                                override fun onFailure(call: Call<AllEventsResponse>, t: Throwable) {
                                    hideLoading()
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
        private const val USER_KEY = "user_key"

        fun newInstance(token: String,username: String) = FragmentViewAllEvents().also {
            it.arguments=Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putString(USER_KEY,username)
            }
        }
    }

    override fun onItemClick(position: Int) {
        val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
        transaction.replace(R.id.container_main,FragmentViewEventDetailed.newInstance(token,username,eventIds[position])).addToBackStack("searchUser")
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