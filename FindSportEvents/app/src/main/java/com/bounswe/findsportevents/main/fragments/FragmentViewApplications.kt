package com.bounswe.findsportevents.main.fragments

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
import com.bounswe.findsportevents.adapter.RecyclerAdapterApplications
import com.bounswe.findsportevents.adapter.RecyclerAdapterSpectators
import com.bounswe.findsportevents.databinding.FragmentViewApplicationsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.ApplicantsRequest
import com.bounswe.findsportevents.network.modalz.responses.ApplicantListResponse
import com.bounswe.findsportevents.network.modalz.responses.ApplicantsResponse
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class FragmentViewApplications : Fragment(), RecyclerAdapterApplications.OnItemClickListener, RecyclerAdapterSpectators.OnItemClickListenerSpectator {
    private var _binding: FragmentViewApplicationsBinding? = null
    private val binding get() = _binding!!

    private var layoutManager: RecyclerView.LayoutManager? = null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterApplications.ViewHolder>? = null
    private var listener: RecyclerAdapterApplications.OnItemClickListener = this
    private var usernames: MutableList<String> = mutableListOf()
    private var favSports: MutableList<String> = mutableListOf()

    private var layoutManagerSpectators: RecyclerView.LayoutManager? = null
    private var adapterSpectators: RecyclerView.Adapter<RecyclerAdapterSpectators.ViewHolder>? = null
    private var listenerSpectators: RecyclerAdapterSpectators.OnItemClickListenerSpectator = this
    private var usernamesSpectators: MutableList<String> = mutableListOf()
    private var favSportsSpectators: MutableList<String> = mutableListOf()
    private var token = ""
    private var eventId = 0
    private var ownerId = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        eventId = requireArguments().getInt(EVENT_ID_KEY)
        ownerId = requireArguments().getInt(OWNER_ID_KEY)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentViewApplicationsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        layoutManager = LinearLayoutManager(context)
        binding.rvPlayers.layoutManager = layoutManager
        adapter = RecyclerAdapterApplications(usernames, favSports, listener)
        binding.rvPlayers.adapter = adapter

        ReboundAPI.create().getApplicants(token, eventId, "player")
            .enqueue(object : Callback<ApplicantListResponse> {
                override fun onResponse(
                    call: Call<ApplicantListResponse>,
                    response: Response<ApplicantListResponse>
                ) {
                    if (response.isSuccessful) {
                        for (i in response.body()?.applicants?.indices!!) {
                            ReboundAPI.create()
                                .getUser(token, response.body()!!.applicants[i].toString())
                                .enqueue(object : Callback<UserResponse> {
                                    override fun onResponse(
                                        call: Call<UserResponse>,
                                        response: Response<UserResponse>
                                    ) {
                                        if (response.isSuccessful) {
                                            usernames.add(response.body()?.username!!)
                                            favSports.add(response.body()?.fav_sport_1!!)

                                            adapter = RecyclerAdapterApplications(
                                                usernames,
                                                favSports,
                                                listener
                                            )
                                            binding.rvPlayers.adapter = adapter
                                        }
                                    }

                                    override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                                    }

                                })
                        }

                    }
                }

                override fun onFailure(call: Call<ApplicantListResponse>, t: Throwable) {
                }

            })

        layoutManagerSpectators = LinearLayoutManager(context)
        binding.rvSpectators.layoutManager = layoutManagerSpectators
        adapterSpectators = RecyclerAdapterSpectators(usernames, favSports, listenerSpectators)
        binding.rvPlayers.adapter = adapterSpectators

        ReboundAPI.create().getApplicants(token, eventId, "spectator")
            .enqueue(object : Callback<ApplicantListResponse> {
                override fun onResponse(
                    call: Call<ApplicantListResponse>,
                    response: Response<ApplicantListResponse>
                ) {
                    if (response.isSuccessful) {
                        for (i in response.body()?.applicants?.indices!!) {
                            ReboundAPI.create()
                                .getUser(token, response.body()!!.applicants[i].toString())
                                .enqueue(object : Callback<UserResponse> {
                                    override fun onResponse(
                                        call: Call<UserResponse>,
                                        response: Response<UserResponse>
                                    ) {
                                        if (response.isSuccessful) {
                                            usernamesSpectators.add(response.body()?.username!!)
                                            favSportsSpectators.add(response.body()?.fav_sport_1!!)

                                            adapterSpectators = RecyclerAdapterSpectators(
                                                usernamesSpectators,
                                                favSportsSpectators,
                                                listenerSpectators
                                            )
                                            binding.rvSpectators.adapter = adapterSpectators
                                        }
                                    }

                                    override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                                    }

                                })
                        }

                    }
                }

                override fun onFailure(call: Call<ApplicantListResponse>, t: Throwable) {
                }

            })


        setClickListeners()
    }

    private fun setClickListeners() {
//        TODO("Not yet implemented")
    }

    companion object {
        const val TAG = "view all events"
        private const val TOKEN_KEY = "token_key"
        private const val EVENT_ID_KEY = "event_id_key"
        private const val OWNER_ID_KEY = "owner_id_key"

        fun newInstance(token: String, eventId: Int, ownerId: Int) =
            FragmentViewApplications().also {
                it.arguments = Bundle().also {
                    it.putString(TOKEN_KEY, token)
                    it.putInt(EVENT_ID_KEY, eventId)
                    it.putInt(OWNER_ID_KEY, ownerId)
                }
            }
    }

    override fun onAcceptOrRejectClickedPlayers(accept: Boolean, username: String) {
        ReboundAPI.create().getUser(token, username).enqueue(object : Callback<UserResponse> {
            override fun onResponse(
                call: Call<UserResponse>,
                response: Response<UserResponse>
            ) {
                if (response.isSuccessful) {

                    val request = ApplicantsRequest(
                        "player",
                        response.body()?.id?.toInt() ?: 0,
                        ownerId,
                        accept
                    )
                    ReboundAPI.create().acceptOrRejectApplicants(token, eventId, request)
                        .enqueue(object : Callback<ApplicantsResponse> {
                            override fun onResponse(
                                call: Call<ApplicantsResponse>,
                                response: Response<ApplicantsResponse>
                            ) {
                                if (response.isSuccessful) {
                                    Toast.makeText(
                                        requireContext(),
                                        response.body()?.summary ?: "",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                            }

                            override fun onFailure(call: Call<ApplicantsResponse>, t: Throwable) {
                            }

                        })
                }
            }

            override fun onFailure(call: Call<UserResponse>, t: Throwable) {
            }

        })
    }

    override fun onProfileClickedPlayers(username: String, position: Int) {
        val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
        transaction.replace(
            R.id.container_main,
            FragmentUserResult.newInstance(token, username, usernames[position])
        ).addToBackStack("userResult")
        transaction.commit()
    }

    override fun onAcceptOrRejectClickedSpectators(accept: Boolean, username: String) {
        ReboundAPI.create().getUser(token, username).enqueue(object : Callback<UserResponse> {
            override fun onResponse(
                call: Call<UserResponse>,
                response: Response<UserResponse>
            ) {
                if (response.isSuccessful) {

                    val request = ApplicantsRequest(
                        "spectator",
                        response.body()?.id?.toInt() ?: 0,
                        ownerId,
                        accept
                    )
                    ReboundAPI.create().acceptOrRejectApplicants(token, eventId, request)
                        .enqueue(object : Callback<ApplicantsResponse> {
                            override fun onResponse(
                                call: Call<ApplicantsResponse>,
                                response: Response<ApplicantsResponse>
                            ) {
                                if (response.isSuccessful) {
                                    Toast.makeText(
                                        requireContext(),
                                        response.body()?.summary ?: "",
                                        Toast.LENGTH_SHORT
                                    ).show()
                                }
                            }

                            override fun onFailure(call: Call<ApplicantsResponse>, t: Throwable) {
                            }

                        })
                }
            }

            override fun onFailure(call: Call<UserResponse>, t: Throwable) {
            }

        })
    }

    override fun onProfileClickedSpectators(username: String, position: Int) {
        val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
        transaction.replace(
            R.id.container_main,
            FragmentUserResult.newInstance(token, username, usernames[position])
        ).addToBackStack("userResult")
        transaction.commit()
    }
}