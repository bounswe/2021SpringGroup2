package com.bounswe.findsportevents.main.fragments

import android.app.DatePickerDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.FragmentSearchEventBinding
import java.text.SimpleDateFormat
import java.util.*

import android.app.TimePickerDialog
import android.app.TimePickerDialog.OnTimeSetListener
import android.widget.*
import androidx.fragment.app.FragmentTransaction


class FragmentSearchEvent : Fragment() ,AdapterView.OnItemSelectedListener{

    private var token = ""
    private var sports = mutableListOf(0)
    private var sport =""
    private var minAge = 0
    private var maxAge = 0
    private var minSkillLevel = ""
    private var maxSkillLevel = ""
    private var startTime=""
    private var endTime = ""
    private var _binding: FragmentSearchEventBinding? = null
    private val binding get() = _binding!!
    private lateinit var searchEventFragListener : FragmentSearchEventListener
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        searchEventFragListener = requireActivity() as FragmentSearchEventListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""

    }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        for(i in 1..100){
            sports.add(i)
        }
        val items = sports

        _binding = FragmentSearchEventBinding.inflate(inflater, container, false)
        val spinner1: Spinner = binding.sportsSpinner
        spinner1.onItemSelectedListener=this
        context?.let {
            ArrayAdapter.createFromResource(
                it,
                R.array.sports_array,
                android.R.layout.simple_spinner_item
            ).also{adapter->
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner1.adapter = adapter
            }

        }

        val spinner2: Spinner = binding.minSkillsSpinner
        spinner2.onItemSelectedListener=this
        context?.let {

            ArrayAdapter.createFromResource(
                it,
                R.array.skills_array,
                android.R.layout.simple_spinner_item
            ).also{adapter->
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner2.adapter = adapter
            }

        }
        val spinner3 : Spinner =binding.minAgeSpinner
        spinner3.onItemSelectedListener=this
        val adapter2: ArrayAdapter<Int>? =
            context?.let { ArrayAdapter<Int>(it, android.R.layout.simple_spinner_item, items).also {
                    adapter2 ->
                adapter2.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner3.adapter = adapter2

            }
            }
        val spinner4 : Spinner =binding.maxAgeSpinner
        spinner4.onItemSelectedListener=this
        val adapter1: ArrayAdapter<Int>? =
            context?.let { ArrayAdapter<Int>(it, android.R.layout.simple_spinner_item, items).also {
                    adapter1 ->
                adapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner4.adapter = adapter1
            }
            }
        val spinner5: Spinner = binding.maxSkillsSpinner
        spinner5.onItemSelectedListener=this
        context?.let {

            ArrayAdapter.createFromResource(
                it,
                R.array.skills_array,
                android.R.layout.simple_spinner_item
            ).also{adapter->
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner5.adapter = adapter
            }

        }





        return binding.root
    }


    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState!!)

        //Save the fragment's state here
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()


    }

    private fun pickDateTime(button: Button) {
        val currentDateTime = Calendar.getInstance()
        val startYear = currentDateTime.get(Calendar.YEAR)
        val startMonth = currentDateTime.get(Calendar.MONTH)
        val startDay = currentDateTime.get(Calendar.DAY_OF_MONTH)
        val startHour = currentDateTime.get(Calendar.HOUR_OF_DAY)
        val startMinute = currentDateTime.get(Calendar.MINUTE)

        DatePickerDialog(requireContext(), DatePickerDialog.OnDateSetListener { _, year, month, day ->
            TimePickerDialog(requireContext(), TimePickerDialog.OnTimeSetListener { _, hour, minute ->
                val pickedDateTime = Calendar.getInstance()

                pickedDateTime.set(year, month, day, hour, minute)
                if(button==binding.btnStartTime){
                binding.tvSelectedStart.text= pickedDateTime.time.toString()
                }
                if(button==binding.btnEndTime){
                    binding.tvSelectedEnd.text= pickedDateTime.time.toString()
                }
            }, startHour, startMinute, true).show()
        }, startYear, startMonth, startDay).show()
    }


    private fun setObservers() {
 //       TODO("Not yet implemented")
    }

    private fun setClickListeners() {

        binding.btnStartTime.setOnClickListener {
            pickDateTime(binding.btnStartTime)
        }
        binding.btnEndTime.setOnClickListener {
            pickDateTime(binding.btnEndTime)
        }
        binding.btnSelectArea.setOnClickListener {
            val mapFragment= FragmentMap()
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentMap.newInstance(token,sport,minSkillLevel,maxSkillLevel,minAge,maxAge,startTime,endTime)).addToBackStack("map")
            transaction.commit()
        }

    }
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    interface FragmentSearchEventListener{
        //TODO: will be implemented later
    }
    companion object {
        const val TAG = "Search Event"
        private const val TOKEN_KEY = "token_key"

        fun newInstance(token: String) = FragmentSearchEvent().apply {
            arguments=Bundle().apply {

                putString(TOKEN_KEY,token)
            }
        }
    }

    override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
        var newItem= p0?.selectedItem
        if (p0 != null) {
            if (p0.id==binding.sportsSpinner.id){
                sport= newItem as String
            }
            if (p0.id==binding.minSkillsSpinner.id){
                minSkillLevel= newItem as String
            }
            if (p0.id==binding.maxSkillsSpinner.id){
                maxSkillLevel= newItem as String
            }
            if (p0.id==binding.minAgeSpinner.id){
                minAge= newItem as Int
            }
            if (p0.id==binding.maxAgeSpinner.id){
                maxAge= newItem as Int
            }

               // Toast.makeText(context,"$sport $skillLevel $minAge - $maxAge",Toast.LENGTH_SHORT).show()
        }

    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
     //   TODO("Not yet implemented")
    }
}