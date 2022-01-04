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
import com.bounswe.findsportevents.databinding.FragmentSearchTransitBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.util.ArrayList

class FragmentSearchTransit : Fragment() {
    private var _binding: FragmentSearchTransitBinding? = null
    private val binding get() = _binding!!
    private var testList= arrayListOf("")
    private var dialog: LoadingDialog? = null
    private var ownerId : Long = 0
    private lateinit var searchTransitFragListener: FragmentSearchTransitListener
    private var token = ""
    private var username = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        searchTransitFragListener = requireActivity() as FragmentSearchTransitListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username= requireArguments().getString(USER_KEY) ?: ""
        testList=requireArguments().getStringArrayList(TEST_KEY) ?: arrayListOf("")
        token="JWT $token"

    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSearchTransitBinding.inflate(inflater, container, false)
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
       binding.btnSearchEvent.setOnClickListener {
           val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
           transaction.replace(R.id.container_main,FragmentSearchEvent.newInstance(token,username,testList)).addToBackStack("myEvents")
           transaction.commit()
       }
        binding.btnSearchUser.setOnClickListener {
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentSearchUser.newInstance(token,username)).addToBackStack("searchUser")
            transaction.commit()
        }
    }

    interface FragmentSearchTransitListener {
        //TODO: will be implemented later
    }

    companion object {
        const val TAG = "search transit"
        private const val TOKEN_KEY = "token_key"
        private const val USER_KEY = "user_key"
        private const val TEST_KEY = "test_key"
        fun newInstance(token: String,username:String,testList : ArrayList<String>) = FragmentSearchTransit().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putStringArrayList(TEST_KEY,testList)
                it.putString(USER_KEY,username)

            }
        }
    }


}