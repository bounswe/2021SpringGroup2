package com.bounswe.findsportevents.main.fragments

import android.annotation.SuppressLint
import android.media.metrics.Event
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.adapter.RecyclerAdapterDiscussion
import com.bounswe.findsportevents.databinding.FragmentViewEventDetailedBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.CommentRequest
import com.bounswe.findsportevents.network.modalz.responses.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.*

class FragmentViewEventDetailed : Fragment(), RecyclerAdapterDiscussion.OnItemClickListener {

    private var _binding: FragmentViewEventDetailedBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapterDiscussion.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterDiscussion.ViewHolder>?=null
    private lateinit var viewEventDetailedFragListener: FragmentViewEventDetailedListener
    private var token = ""
    private var username = ""
    private var eventId = 0
    private var comments : MutableList<String> = mutableListOf("bruh moment","falan filan")
    private var users : MutableList<String> = mutableListOf("ali","veli")
    private var dates : MutableList<String> = mutableListOf("bugun","yarin")
    private var name =""
    private var ownerId= 0
    private var content = ""
    private var creationDate = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewEventDetailedFragListener = requireActivity() as FragmentViewEventDetailedListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USER_KEY) ?: ""
        eventId = requireArguments().getInt(EVENT_KEY) ?: 0
        ReboundAPI.create().getEventbyId(token,eventId).enqueue(object : Callback<EventbyIdResponse>{
            @SuppressLint("SetTextI18n")
            override fun onResponse(call: Call<EventbyIdResponse>, response: Response<EventbyIdResponse>) {
                if (response.isSuccessful) {
                    binding.tvEventTitleResult.text = response.body()?.`object`?.title ?: ""
                    binding.tvEventTypeResult.text=response.body()?.`object`?.eventSport
                    binding.tvEventLocationResult.text = response.body()?.`object`?.location?.name ?:""
                    binding.tvDateResult.text = response.body()?.`object`?.eventDate.toString()
                    binding.tvAgeIntervalResult.text= "${response.body()?.`object`?.eventMinAge.toString()}  - ${response.body()?.`object`?.eventMaxAge.toString()}"
                    layoutManager= LinearLayoutManager(context)
                    binding.rvDiscussion.layoutManager=layoutManager
                    adapter = RecyclerAdapterDiscussion(users,comments,dates, listener)


                    binding.rvDiscussion.adapter = adapter

                }
            }

            override fun onFailure(call: Call<EventbyIdResponse>, t: Throwable) {
                //TODO("Not yet implemented")
            }

        })
        ReboundAPI.create().getAllComments(token,eventId).enqueue(object :Callback<AllCommentsResponse>{
            override fun onResponse(
                call: Call<AllCommentsResponse>,
                response: Response<AllCommentsResponse>
            ) {
                if(response.isSuccessful){
                    for(i in 0 until response.body()?.items?.size!!) {
                        comments.add(response.body()!!.items.get(i).`object`.content)
                        users.add(response.body()!!.items.get(i).actor.name)
                        dates.add(response.body()!!.items.get(i).`object`.creationDate)
                    }
                    layoutManager= LinearLayoutManager(context)
                    binding.rvDiscussion.layoutManager=layoutManager
                    adapter = RecyclerAdapterDiscussion(users,comments,dates, listener)
                    binding.rvDiscussion.adapter = adapter
                }
            }

            override fun onFailure(call: Call<AllCommentsResponse>, t: Throwable) {
                //
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
            binding.btnEquipment.setOnClickListener{
                val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
                transaction.add(R.id.container_main,FragmentEquipmentResults.newInstance(token,binding.tvEventTypeResult.text.toString())).addToBackStack("equipmentResults")
                transaction.commit()
            }
            binding.btnPostComment.setOnClickListener {
                val pickedDateTime = Calendar.getInstance()
                val tz= TimeZone.getTimeZone("UTC")
                val sdf= SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
                val request = CommentRequest(
                    username,
                    ownerId,
                    binding.etComment.text.toString(),
                    sdf.toString()
                )
                ReboundAPI.create().postComment(token,eventId,request).enqueue(object: Callback<CommentResponse>{
                    override fun onResponse(
                        call: Call<CommentResponse>,
                        response: Response<CommentResponse>
                    ) {
                        if(response.isSuccessful){
                            Toast.makeText(requireContext(), "COMMENT SUCCESSFULLY POSTED", Toast.LENGTH_SHORT).show()
                            ReboundAPI.create().getAllComments(token,eventId).enqueue(object :Callback<AllCommentsResponse>{
                                override fun onResponse(
                                    call: Call<AllCommentsResponse>,
                                    response: Response<AllCommentsResponse>
                                ) {
                                    if(response.isSuccessful){
                                        comments = mutableListOf("bruh moment","falan filan")
                                        users = mutableListOf("ali","veli")
                                        dates = mutableListOf("bugun","yarin")
                                        for(i in 0 until response.body()?.items?.size!!) {
                                            comments.add(response.body()!!.items.get(i).`object`.content)
                                            users.add(response.body()!!.items.get(i).actor.name)
                                            dates.add(response.body()!!.items.get(i).`object`.creationDate)
                                        }
                                        layoutManager= LinearLayoutManager(context)
                                        binding.rvDiscussion.layoutManager=layoutManager
                                        adapter = RecyclerAdapterDiscussion(users,comments,dates, listener)
                                        binding.rvDiscussion.adapter = adapter
                                    }
                                }

                                override fun onFailure(call: Call<AllCommentsResponse>, t: Throwable) {
                                    //
                                }

                            })

                        }
                    }

                    override fun onFailure(call: Call<CommentResponse>, t: Throwable) {
                        Toast.makeText(requireContext(), "AN ERROR OCCURRED, PLEASE TRY AGAIN", Toast.LENGTH_SHORT).show()
                    }

                })

            }
    }

    interface FragmentViewEventDetailedListener{
        //        TODO("Not yet implemented")
    }




    companion object {
        val TAG = "FragmentViewEventDetailed"
        private const val TOKEN_KEY = "token_key"
        private const val EVENT_KEY = "event_key"
        private const val USER_KEY = "user_key"
        fun newInstance(token: String,username:String,eventId: Int) = FragmentViewEventDetailed().also {
            it.arguments=Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putString(USER_KEY,username)
                it.putInt(EVENT_KEY,eventId)
            }
        }

    }

    override fun onItemClick(position: Int) {
        //
    }
}