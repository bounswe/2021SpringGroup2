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


class FragmentSearchEvent : Fragment() {

    private var token = ""
    private var sports = mutableListOf(0)
    private var dateTime=""
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

        val spinner2: Spinner = binding.skillsSpinner
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
        val adapter2: ArrayAdapter<Int>? =
            context?.let { ArrayAdapter<Int>(it, android.R.layout.simple_spinner_item, items).also {
                    adapter2 ->
                adapter2.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner3.adapter = adapter2
            }
            }
        val spinner4 : Spinner =binding.maxAgeSpinner
        val adapter1: ArrayAdapter<Int>? =
            context?.let { ArrayAdapter<Int>(it, android.R.layout.simple_spinner_item, items).also {
                    adapter1 ->
                adapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner4.adapter = adapter1
            }
            }





        return binding.root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()


    }
    private fun clickDatePicker(view: View){
        var myCalendar = Calendar.getInstance()
        val year=myCalendar.get(Calendar.YEAR)
        val month=myCalendar.get(Calendar.MONTH)
        val day=myCalendar.get(Calendar.DAY_OF_MONTH)
        val hour=myCalendar.get(Calendar.HOUR_OF_DAY)
        context?.let {
            DatePickerDialog(it,
                DatePickerDialog.OnDateSetListener { _, SelectedYear, SelectedMonth, SelectedDayOfMonth ->
                    Toast.makeText(
                        context,
                        "The selected date is ${SelectedDayOfMonth}/${SelectedMonth + 1}/${SelectedYear}",
                        Toast.LENGTH_LONG
                    ).show()
                    val selectedDate = "$SelectedDayOfMonth/${SelectedMonth + 1}/$SelectedYear"
                    val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.ENGLISH)
                    val theDate = sdf.parse(selectedDate)
                    dateTime=theDate.toString()
                    binding.tvSelectedDate.text = theDate.toString()


                }, year, month, day).show()
        }
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
        binding.btnDate.setOnClickListener {view ->
            clickDatePicker(view)
        }
        binding.btnStartTime.setOnClickListener {
            pickDateTime(binding.btnStartTime)
        }
        binding.btnEndTime.setOnClickListener {
            pickDateTime(binding.btnEndTime)
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
}