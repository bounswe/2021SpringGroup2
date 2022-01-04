package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.FragmentUserResultBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception

class FragmentUserResult : Fragment(), DialogManager {
    private var _binding: FragmentUserResultBinding? = null
    private val binding get() = _binding!!

    private var dialog: LoadingDialog? = null
    private var ownerId : Long = 0
    private lateinit var userResultFragListener: FragmentUserResultListener
    private var token = ""
    private var username = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        userResultFragListener = requireActivity() as FragmentUserResultListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USERNAME_KEY) ?: ""

        context?.run {
            showLoading(this)
        }
        ReboundAPI.create().getUser(token, username).enqueue(object: Callback<UserResponse> {
            override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                hideLoading()
                if(response.isSuccessful){
                    binding.etFirstName.setText(response.body()?.first_name ?: "")
                    binding.etLastName.setText(response.body()?.last_name ?: "")
                    binding.etBio.setText(response.body()?.bio ?: "")
                    binding.etFavSport1.setText(response.body()?.fav_sport_1 ?: "")
                    binding.etFavSport2.setText(response.body()?.fav_sport_2 ?: "")
                    binding.etFavSport3.setText(response.body()?.fav_sport_3 ?: "")
                    binding.etLocation.setText(response.body()?.location ?: "")
                    ownerId= response.body()?.id ?: 0
                    if (!response.body()?.badges.isNullOrEmpty()){
                        var str = ""
                        for (badge in response.body()?.badges!!) {
                            str += "$badge "
                        }
                        binding.etBadges.setText(str)
                    }
                }
            }

            override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                hideLoading()
            }

        })
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentUserResultBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setObservers() {
//        TODO("Not yet implemented")
    }

    private fun setClickListeners() {
        binding.btnViewEvents.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentMyEvents.newInstance(token,ownerId)).addToBackStack("myEvents")
            transaction.commit()
        }
        binding.btnGiveABadge.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentRelatedEvents.newInstance(token,ownerId,username)).addToBackStack("myEvents")
            transaction.commit()
        }
    }

    interface FragmentUserResultListener {
        //TODO: will be implemented later
    }

    companion object {
        const val TAG = "UserResult"
        private const val TOKEN_KEY = "token_key"
        private const val USERNAME_KEY = "username_key"

        fun newInstance(token: String, username: String) = FragmentUserResult().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putString(USERNAME_KEY, username)
            }
        }
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