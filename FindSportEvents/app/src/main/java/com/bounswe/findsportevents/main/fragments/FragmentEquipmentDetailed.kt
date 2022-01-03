package com.bounswe.findsportevents.main.fragments

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapterDiscussion
import com.bounswe.findsportevents.databinding.FragmentEquipmentDetailedBinding
import com.bounswe.findsportevents.databinding.FragmentViewEventDetailedBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.CommentRequest
import com.bounswe.findsportevents.network.modalz.responses.AllCommentsResponse
import com.bounswe.findsportevents.network.modalz.responses.CommentResponse
import com.bounswe.findsportevents.network.modalz.responses.EquipmentbyIdResponse
import com.bounswe.findsportevents.network.modalz.responses.EventbyIdResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.*

class FragmentEquipmentDetailed : Fragment(), RecyclerAdapterDiscussion.OnItemClickListener {

    private var _binding: FragmentEquipmentDetailedBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapterDiscussion.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterDiscussion.ViewHolder>?=null
    private lateinit var equipmentDetailedFragListener: FragmentEquipmentDetailedListener
    private var token = ""
    private var username= ""
    private var postId = 0
    private var comments : MutableList<String> = mutableListOf()
    private var users : MutableList<String> = mutableListOf()
    private var dates : MutableList<String> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        equipmentDetailedFragListener = requireActivity() as FragmentEquipmentDetailedListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USER_KEY) ?: ""
        postId = requireArguments().getInt(POST_KEY) ?: 0
        ReboundAPI.create().getEquipmentbyId(token,postId).enqueue(object : Callback<EquipmentbyIdResponse>{
            override fun onResponse(
                call: Call<EquipmentbyIdResponse>,
                response: Response<EquipmentbyIdResponse>
            ) {
                if(response.isSuccessful){
                    binding.tvTitle.text= response.body()?.`object`?.title ?: ""
                    binding.tvDescription.text = response.body()?.`object`?.content?: ""

                }
            }

            override fun onFailure(call: Call<EquipmentbyIdResponse>, t: Throwable) {
               // TODO("Not yet implemented")
            }

        })
        ReboundAPI.create().getAllEquipmentComments(token,postId).enqueue(object :Callback<AllCommentsResponse>{
            override fun onResponse(
                call: Call<AllCommentsResponse>,
                response: Response<AllCommentsResponse>
            ) {
                if(response.isSuccessful){
                    comments = mutableListOf()
                    users = mutableListOf()
                    dates = mutableListOf()
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
        _binding = FragmentEquipmentDetailedBinding.inflate(inflater, container, false)
        layoutManager= LinearLayoutManager(context)
        binding.rvDiscussion.layoutManager=layoutManager
        adapter = RecyclerAdapterDiscussion(users,comments,dates, listener)


        binding.rvDiscussion.adapter = adapter
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
       binding.btnPostComment.setOnClickListener {
           val pickedDateTime = Calendar.getInstance()
           val tz= TimeZone.getTimeZone("UTC")
           val sdf= SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
           val currentDate=sdf.format(Date())
           val request = CommentRequest(
               username,
               0,
               binding.etComment.text.toString(),
               Date().toString()
           )
           ReboundAPI.create().postEquipmentComment(token,postId,request).enqueue(object: Callback<CommentResponse>{
               override fun onResponse(
                   call: Call<CommentResponse>,
                   response: Response<CommentResponse>
               ) {
                   if(response.isSuccessful){
                       Toast.makeText(requireContext(), "COMMENT SUCCESSFULLY POSTED", Toast.LENGTH_SHORT).show()
                       ReboundAPI.create().getAllEquipmentComments(token,postId).enqueue(object :Callback<AllCommentsResponse>{
                           override fun onResponse(
                               call: Call<AllCommentsResponse>,
                               response: Response<AllCommentsResponse>
                           ) {
                               if(response.isSuccessful){
                                   comments = mutableListOf()
                                   users = mutableListOf()
                                   dates = mutableListOf()
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

    interface FragmentEquipmentDetailedListener{
        //        TODO("Not yet implemented")
    }




    companion object {
        val TAG = "FragmentEquipmentDetailed"
        private const val TOKEN_KEY = "token_key"
        private const val POST_KEY = "post_key"
        private const val USER_KEY = "user_key"
        fun newInstance(token: String,username:String,postId: Int) = FragmentEquipmentDetailed().also {
            it.arguments= Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putInt(POST_KEY,postId)
                it.putString(USER_KEY,username)
            }
        }

    }

    override fun onItemClick(position: Int) {
        //
    }
}