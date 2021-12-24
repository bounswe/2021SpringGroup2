package com.bounswe.findsportevents.main.fragments

import android.app.DatePickerDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentProfileBinding
import com.bounswe.findsportevents.main.MainActivity
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*

class FragmentProfile : Fragment(), DialogManager {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private var dialog: LoadingDialog? = null

    private lateinit var profileFragListener: FragmentProfileListener
    private var token = ""
    private var username = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        profileFragListener = requireActivity() as FragmentProfileListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        token="JWT $token"
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
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
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
//        binding.btnDatePicker.setOnClickListener{View -> clickDatePicker(View)}
    }

    interface FragmentProfileListener {
        //TODO: will be implemented later
    }

    companion object {
        const val TAG = "profile"
        private const val TOKEN_KEY = "token_key"
        private const val USERNAME_KEY = "username_key"

        fun newInstance(token: String, username: String) = FragmentProfile().also {
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