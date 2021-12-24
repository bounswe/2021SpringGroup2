package com.bounswe.findsportevents.main.fragments

import android.annotation.SuppressLint
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
import android.os.Build
import android.widget.*
import androidx.fragment.app.FragmentTransaction
import androidx.annotation.RequiresApi
import androidx.fragment.app.*
import androidx.lifecycle.LifecycleOwner
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.network.DecathlonAPI
import com.bounswe.findsportevents.network.modalz.responses.DataResponse
import com.bounswe.findsportevents.network.modalz.responses.GetSportsResponse
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.max
import kotlin.math.min


class FragmentSearchEvent : Fragment() ,AdapterView.OnItemSelectedListener{

    private var token = ""
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapter.ViewHolder>?=null
    private var sports = mutableListOf(0)
    private var testList= arrayListOf("")
    private var sport =""
    private var minAge = 0
    private var maxAge = 100
    private var minSkillLevel = "1"
    private var maxSkillLevel = "5"
    private var minLongitude=0f
    private var maxLongitude=0f
    private var minLatitude=0f
    private var maxLatitude=0f
    private var startTime=""
    private var endTime = ""

    private var minDuration =0
    private var maxDuration =100000
    private var m1Latitude=0f
    private var m1Longitude=0f
    private var m2Latitude=0f
    private var m2Longitude=0f


    private var result=""

    private var _binding: FragmentSearchEventBinding? = null
    private val binding get() = _binding!!
    private lateinit var searchEventFragListener : FragmentSearchEventListener
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        searchEventFragListener = requireActivity() as FragmentSearchEventListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""

    }
        setFragmentListeners()

        searchEventFragListener = requireActivity() as FragmentSearchEventListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        testList=requireArguments().getStringArrayList(TEST_KEY) ?: arrayListOf("")
        token="JWT $token"//Adding JWT at the beginning of the token


    }

    override fun onResume() {

        super.onResume()
        setFragmentListeners()
    }
    @SuppressLint("ResourceType")
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

        setFragmentListeners()
        val spinner1 : Spinner =binding.sportsSpinner

        spinner1.onItemSelectedListener=this
        val adapter3: ArrayAdapter<String>? =
            context?.let { ArrayAdapter<String>(it, android.R.layout.simple_spinner_item, testList).also {
                    adapter3 ->
                adapter3.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner1.adapter = adapter3

            }
            }

        val spinner2: Spinner = binding.minSkillsSpinner
        spinner2.onItemSelectedListener=this
        context?.let {

            ArrayAdapter.createFromResource(
                it,
                R.array.age_array,
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
                spinner4.setSelection(100)
            }
            }
        val spinner5: Spinner = binding.maxSkillsSpinner
        spinner5.onItemSelectedListener=this
        context?.let {

            ArrayAdapter.createFromResource(
                it,
                R.array.age_array,
                android.R.layout.simple_spinner_item
            ).also{adapter->
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                spinner5.adapter = adapter
                spinner5.setSelection(4)
            }

        }





        return binding.root
    }


    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState!!)

        //Save the fragment's state here
    }
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()


    }
    private fun setFragmentListeners(){
        setFragmentResultListener(REQUEST_KEY) { key, bundle ->
            val resultReceived = bundle.getFloat(BUNDLE_KEY)
            m1Latitude=resultReceived
            binding.tvCoordinates1.text=resultReceived.toString()
            // ...
        }
        setFragmentResultListener("request_key1") { key, bundle ->
            val resultReceived = bundle.getFloat("bundle_key1")
           m1Longitude=resultReceived
            binding.tvCoordinates1.text="${binding.tvCoordinates1.text},${resultReceived.toString()}"
        }
        setFragmentResultListener("request_key2") { key, bundle ->
            val resultReceived = bundle.getFloat("bundle_key2")
            m2Latitude=resultReceived
            binding.tvCoordinates2.text=resultReceived.toString()
        }
        setFragmentResultListener("request_key3") { key, bundle ->
            val resultReceived = bundle.getFloat("bundle_key3")
            m2Longitude=resultReceived
            binding.tvCoordinates2.text="${binding.tvCoordinates2.text},${resultReceived.toString()}"
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun pickDateTime(button: Button) {
        val currentDateTime = Calendar.getInstance()
        val startYear = currentDateTime.get(Calendar.YEAR)
        val startMonth = currentDateTime.get(Calendar.MONTH)
        val startDay = currentDateTime.get(Calendar.DAY_OF_MONTH)
        val startHour = currentDateTime.get(Calendar.HOUR_OF_DAY)
        val startMinute = currentDateTime.get(Calendar.MINUTE)
        val startSecond=currentDateTime.get(Calendar.SECOND)

        DatePickerDialog(requireContext(), DatePickerDialog.OnDateSetListener { _, year, month, day ->
            TimePickerDialog(requireContext(), TimePickerDialog.OnTimeSetListener { _, hour, minute ->
                val pickedDateTime = Calendar.getInstance()
                val tz=TimeZone.getTimeZone("UTC")
                val sdf=SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
                sdf.timeZone=tz
                pickedDateTime.set(year, month, day, hour, minute,Calendar.getInstance().time.seconds)
                if(button==binding.btnStartTime){
                    val isoDate=sdf.format(pickedDateTime.time)
                binding.tvSelectedStart.text= isoDate.toString()
                }
                if(button==binding.btnEndTime){
                    val isoDate=sdf.format(pickedDateTime.time)
                    binding.tvSelectedEnd.text= isoDate.toString()
                }
                startTime=binding.tvSelectedStart.text.toString()
                endTime=binding.tvSelectedEnd.text.toString()
            }, startHour, startMinute, true).show()
        }, startYear, startMonth, startDay).show()
    }


    private fun setObservers() {
 //       TODO("Not yet implemented")
    }

    @RequiresApi(Build.VERSION_CODES.O)
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
            transaction.replace(R.id.container_main,FragmentMap.newInstance(token,sport,token,token,minAge,maxAge,startTime,endTime)).addToBackStack("map")
            transaction.commit()
        }
        binding.btnFindEvents.setOnClickListener {
            maxLatitude=max(m1Latitude,m2Latitude)
            minLatitude= min(m1Latitude,m2Latitude)
            maxLongitude=max(m1Longitude,m2Longitude)
            minLongitude=min(m1Longitude,m2Longitude)
            if(!binding.etMinDuration.text.toString().equals("")) {
                minDuration = binding.etMinDuration.text?.toString()?.toInt() ?: 0
            }
            if(!binding.etMaxDuration.text.toString().equals("")) {
                maxDuration = binding.etMaxDuration.text?.toString()?.toInt() ?: 10000

            }
            val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main,FragmentSearchResults.newInstance(token,sport,minSkillLevel.toInt(),maxSkillLevel.toInt(),minAge,maxAge,startTime,endTime,minDuration
            ,maxDuration,minLatitude,maxLatitude,minLongitude,maxLongitude))
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

        private const val TEST_KEY = "test_key"
        const val REQUEST_KEY ="request_key"
        const val BUNDLE_KEY ="bundle_key"


        fun newInstance(token: String,testList : ArrayList<String>) = FragmentSearchEvent().apply {
            arguments=Bundle().apply {
                putStringArrayList(TEST_KEY,testList)
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