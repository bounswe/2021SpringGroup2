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
import androidx.fragment.app.FragmentTransaction
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.FragmentProfileBinding
import com.bounswe.findsportevents.extensions.startActivity
import com.bounswe.findsportevents.login.LoginActivity
import com.bounswe.findsportevents.main.MainActivity
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.UpdateProfileRequest
import com.bounswe.findsportevents.network.modalz.responses.UpdateProfileResponse
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList

class FragmentProfile : Fragment(), DialogManager {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private var dialog: LoadingDialog? = null
    private var ownerId : Long = 0
    private lateinit var profileFragListener: FragmentProfileListener
    private var token = ""
    private var username = ""
    private var testList : ArrayList<String> = arrayListOf()
    private var badgeList: List<String> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        profileFragListener = requireActivity() as FragmentProfileListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        token="JWT $token"
        username = requireArguments().getString(USERNAME_KEY) ?: ""
        testList = requireArguments().getStringArrayList(TEST_KEY) ?: arrayListOf()

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
                    if (!response.body()?.badges.isNullOrEmpty()){
                        badgeList = response.body()?.badges ?: emptyList()
                        var str = ""
                        for (badge in response.body()?.badges!!) {
                            str += "$badge, "
                        }
                        binding.etBadges.setText(str)
                    }
                    ownerId= response.body()?.id ?: 0
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
        binding.buttonUpdateProfile.setOnClickListener {
            val request = UpdateProfileRequest(
                binding.etFirstName.text.toString(),
                binding.etLastName.text.toString(),
                binding.etBio.text.toString(),
                binding.etFavSport1.text.toString(),
                binding.etFavSport2.text.toString(),
                binding.etFavSport3.text.toString(),
                binding.etLocation.text.toString(),
                "https://www.pausedergi.com/wp-content/uploads/2021/02/cemil-3.jpg", // TODO CHANGE IT LATER
                false // TODO CHANGE IT LATER
            )
            ReboundAPI.create().updateUser(token, username, request).enqueue(object: Callback<UpdateProfileResponse> {
                override fun onResponse(
                    call: Call<UpdateProfileResponse>,
                    response: Response<UpdateProfileResponse>
                ) {
                    if(response.isSuccessful){
                        Toast.makeText(requireContext(), "PROFILE UPDATE SUCCESSFULLY DONE!", Toast.LENGTH_SHORT).show()
                    }else {
                        Toast.makeText(requireContext(), "AN ERROR OCCURRED, PLEASE TRY AGAIN", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<UpdateProfileResponse>, t: Throwable) {
                    Toast.makeText(requireContext(), "AN ERROR OCCURRED, PLEASE TRY AGAIN", Toast.LENGTH_SHORT).show()
                }

            })
        }
        binding.btnViewEvents.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentMyEvents.newInstance(token,ownerId)).addToBackStack("myEvents")
            transaction.commit()


        }
        binding.btnAddEquipment.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentCreateEquipment.newInstance(token, username, testList)).addToBackStack("myEvents")
            transaction.commit()

        }
        binding.btnViewPlayedEvents.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.add(R.id.container_main,FragmentPlayedEvents.newInstance(token,ownerId)).addToBackStack("myEvents")
            transaction.commit()
        }
        binding.btnViewFollowing.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.add(R.id.container_main,FragmentFollowing.newInstance(token,username)).addToBackStack("myEvents")
            transaction.commit()
        }
        binding.btnViewBadges.setOnClickListener {
            val badgeArrayList = ArrayList<String>(badgeList)
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentViewBadges.newInstance(token, badgeArrayList)).addToBackStack("myEvents")
            transaction.commit()
        }
        binding.btnLogout.setOnClickListener {
            val intent = Intent (activity, LoginActivity::class.java)
            requireActivity().startActivity(intent)
            requireActivity().finish()
        }
    }

    interface FragmentProfileListener {
        //TODO: will be implemented later
    }

    companion object {
        const val TAG = "profile"
        private const val TOKEN_KEY = "token_key"
        private const val USERNAME_KEY = "username_key"
        private const val TEST_KEY = "test_key"

        fun newInstance(token: String, username: String,testList : ArrayList<String>) = FragmentProfile().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putString(USERNAME_KEY, username)
                it.putStringArrayList(TEST_KEY, testList)
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