package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.databinding.FragmentHomeBinding

class FragmentHome : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private var token = ""


    private lateinit var homeFragListener: FragmentHomeListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        homeFragListener = requireActivity() as FragmentHomeListener

    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
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
    binding.btnViewEvents.setOnClickListener{
        val viewAllEventsFragment= FragmentViewAllEvents()
        val transaction:FragmentTransaction=parentFragmentManager.beginTransaction()
        transaction.replace(R.id.home_container,FragmentViewAllEvents.newInstance(token),)

        transaction.commit()
    }
    }

    interface FragmentHomeListener {
        //TODO: will be implemented later
    }

    companion object {
        const val TAG = "home"
    }
}
