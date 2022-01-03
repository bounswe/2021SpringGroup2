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
import com.bounswe.findsportevents.adapter.RecyclerAdapterBadges
import com.bounswe.findsportevents.databinding.FragmentRelatedEventsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.network.modalz.responses.RelatedEventResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception

class FragmentRelatedEvents : Fragment(), RecyclerAdapterBadges.OnItemClickListener , DialogManager{
    private var _binding: FragmentRelatedEventsBinding? = null
    private val binding get() = _binding!!
    private var listener: RecyclerAdapterBadges.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager? = null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterBadges.ViewHolder>? = null
    private var token = ""
    private var username = ""
    private var dialog: LoadingDialog? = null
    var ownerId : Long=0
    var events: MutableList<String> = mutableListOf()
    var eventTitles: MutableList<String> = mutableListOf()
    var creators: MutableList<Int> = mutableListOf()
    var date: MutableList<String> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USERNAME_KEY) ?: ""
        ownerId = requireArguments().getLong(OWNER_KEY) ?: 0
        token = "$token"
        context?.run {
            showLoading(this)
        }

        ReboundAPI.create().getRelatedEvents(token,username).enqueue(object: Callback<RelatedEventResponse> {
            override fun onResponse(
                call: Call<RelatedEventResponse>,
                response: Response<RelatedEventResponse>
            ) {
                hideLoading()
                if(response.isSuccessful){
                    for (i in 0 until response.body()?.totalItems!!) {
                        response.body()?.items?.get(i)?.let { events.add(it.`object`.eventSport) }
                        response.body()?.items?.get(i)?.let { eventTitles.add(it.`object`.title) }
                        response.body()?.items?.get(i)?.let { creators.add(it.`object`.postId) }
                        response.body()?.items?.get(i)?.let { date.add(it.`object`.eventDate) }
                    }

                    layoutManager = LinearLayoutManager(context)
                    binding.recyclerView.layoutManager = layoutManager
                    adapter = RecyclerAdapterBadges(
                        events,
                        eventTitles,
                        creators,
                        date,
                        listener
                    )


                    binding.recyclerView.adapter = adapter
                }
            }

            override fun onFailure(call: Call<RelatedEventResponse>, t: Throwable) {
                hideLoading()
            }

        })


    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        _binding = FragmentRelatedEventsBinding.inflate(inflater, container, false)
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
        private const val OWNER_KEY = "owner_key"
        private const val USERNAME_KEY = "username_key"

        fun newInstance(token: String, owner : Long, username: String) = FragmentRelatedEvents().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putLong(OWNER_KEY, owner)
                it.putString(USERNAME_KEY, username)
            }
        }
    }

    override fun onItemClick() {
//        Toast.makeText(context, "Give a badge clicked", Toast.LENGTH_SHORT).show()
        val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
        transaction.replace(R.id.container_main,FragmentGiveABadge.newInstance(token)).addToBackStack("myEvents")
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