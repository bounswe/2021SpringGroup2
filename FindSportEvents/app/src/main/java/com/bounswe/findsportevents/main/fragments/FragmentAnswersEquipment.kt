package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapterDiscussion
import com.bounswe.findsportevents.databinding.FragmentAnswersBinding
import com.bounswe.findsportevents.databinding.FragmentAnswersEquipmentBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllCommentsResponse
import com.bounswe.findsportevents.network.modalz.responses.CommentResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentAnswersEquipment : Fragment(), RecyclerAdapterDiscussion.OnItemClickListener {

    private var _binding: FragmentAnswersEquipmentBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapterDiscussion.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterDiscussion.ViewHolder>?=null
    private lateinit var answersEquipmentFragListener: FragmentAnswersEquipmentListener
    private var token = ""
    private var username = ""
    private var eventId = 0
    private var commentId=0
    private var comments : MutableList<String> = mutableListOf()
    private var users : MutableList<String> = mutableListOf()
    private var dates : MutableList<String> = mutableListOf()
    private var name =""
    private var ownerId= 0
    private var content = ""
    private var creationDate = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        answersEquipmentFragListener = requireActivity() as FragmentAnswersEquipmentListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USER_KEY) ?: ""
        eventId = requireArguments().getInt(EVENT_KEY) ?: 0
        commentId = requireArguments().getInt(COMMENT_KEY) ?: 0
        ReboundAPI.create().getEquipmentAnswers(token,eventId,commentId).enqueue(object :
            Callback<AllCommentsResponse> {
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
                    binding.recyclerViewAnswers.layoutManager=layoutManager
                    adapter = RecyclerAdapterDiscussion(users,comments,dates, listener)
                    binding.recyclerViewAnswers.adapter = adapter
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
        _binding = FragmentAnswersEquipmentBinding.inflate(inflater, container, false)
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
            var dict :MutableMap<String,String> = mutableMapOf()
            dict.put("content",binding.etMakeComment.text.toString())
            ReboundAPI.create().postEquipmentAnswers(token,eventId,commentId,dict).enqueue(object :
                Callback<CommentResponse> {
                override fun onResponse(
                    call: Call<CommentResponse>,
                    response: Response<CommentResponse>
                ) {
                    if(response.isSuccessful){
                        Toast.makeText(requireContext(), "YOUR ANSWER IS SUCCESSFULLY POSTED!", Toast.LENGTH_SHORT).show()
                        ReboundAPI.create().getEquipmentAnswers(token,eventId,commentId).enqueue(object :
                            Callback<AllCommentsResponse> {
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
                                    binding.recyclerViewAnswers.layoutManager=layoutManager
                                    adapter = RecyclerAdapterDiscussion(users,comments,dates, listener)
                                    binding.recyclerViewAnswers.adapter = adapter
                                }
                            }

                            override fun onFailure(call: Call<AllCommentsResponse>, t: Throwable) {
                                //
                            }

                        })
                    }
                }

                override fun onFailure(call: Call<CommentResponse>, t: Throwable) {
                    Toast.makeText(requireContext(), "SOMETHING WENT WRONG, PLEASE TRY AGAIN LATER", Toast.LENGTH_SHORT).show()
                }

            })


        }
    }

    interface FragmentAnswersEquipmentListener{
        //        TODO("Not yet implemented")
    }




    companion object {
        val TAG = "FragmentAnswers"
        private const val TOKEN_KEY = "token_key"
        private const val EVENT_KEY = "event_key"
        private const val USER_KEY = "user_key"
        private const val COMMENT_KEY = "comment_key"
        fun newInstance(token: String,username:String,eventId: Int,commentId:Int) = FragmentAnswersEquipment().also {
            it.arguments= Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putString(USER_KEY,username)
                it.putInt(EVENT_KEY,eventId)
                it.putInt(COMMENT_KEY,commentId)
            }
        }

    }

    override fun onItemClick(position: Int) {
        //
    }
}