package com.bounswe.findsportevents.main.fragments

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.setFragmentResultListener
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.FragmentCreateEventBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.CreateEventRequest
import com.bounswe.findsportevents.network.modalz.responses.CreateEventResponse
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*

class FragmentCreateEvent : Fragment(), DialogManager {
    private var _binding: FragmentCreateEventBinding? = null
    private val binding get() = _binding!!

    private var dialog: LoadingDialog? = null

    private lateinit var createEventListener: FragmentCreateEventListener
    private var token = ""
    private var username = ""
    private var testList= arrayListOf("")
    private lateinit var startTime: Date
    private lateinit var startTimeIso: String
    private lateinit var endTime: Date
    private lateinit var endTimeIso: String


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        createEventListener = requireActivity() as FragmentCreateEventListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USERNAME_KEY) ?: ""
        testList=requireArguments().getStringArrayList(TEST_KEY) ?: arrayListOf("")
        token = "JWT $token"
        setFragmentListeners()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCreateEventBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setSpinners()
        setClickListeners()
    }

    private fun setDatePickers(isStart: Boolean) {

        val currentDateTime = Calendar.getInstance()
        val startYear = currentDateTime.get(Calendar.YEAR)
        val startMonth = currentDateTime.get(Calendar.MONTH)
        val startDay = currentDateTime.get(Calendar.DAY_OF_MONTH)
        val startHour = currentDateTime.get(Calendar.HOUR_OF_DAY)
        val startMinute = currentDateTime.get(Calendar.MINUTE)

        DatePickerDialog(
            requireContext(),
            DatePickerDialog.OnDateSetListener { _, year, month, day ->
                TimePickerDialog(
                    requireContext(),
                    TimePickerDialog.OnTimeSetListener { _, hour, minute ->
                        val pickedDateTime = Calendar.getInstance()
                        val tz = TimeZone.getTimeZone("UTC")
                        val sdf= SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'")
                        sdf.timeZone = tz
                        pickedDateTime.set(year, month, day, hour, minute, Calendar.getInstance().time.seconds)

                        if (isStart) {
                            startTime = pickedDateTime.time
                            binding.etEventDateStart.setText(pickedDateTime.time.toString())
                            startTimeIso = sdf.format(pickedDateTime.time).toString()
                            Toast.makeText(requireContext(), startTimeIso, Toast.LENGTH_SHORT).show()
                        } else {
                            endTime = pickedDateTime.time
                            binding.etEventDateEnd.setText(pickedDateTime.time.toString())
                            endTimeIso = sdf.format(pickedDateTime.time).toString()
                            Toast.makeText(requireContext(), endTimeIso, Toast.LENGTH_SHORT).show()
                        }

                    },
                    startHour,
                    startMinute,
                    true
                ).show()
            },
            startYear,
            startMonth,
            startDay
        ).show()

    }

    private fun setSpinners() {
        val sportItems = resources.getStringArray(R.array.sport_types_array)
        val sportSpinnerAdapter = object : ArrayAdapter<String>(
            requireContext(),
            android.R.layout.simple_spinner_item,
            testList
        ) {

            override fun getDropDownView(
                position: Int,
                convertView: View?,
                parent: ViewGroup
            ): View {
                val view: TextView =
                    super.getDropDownView(position, convertView, parent) as TextView
                return view
            }
        }
        sportSpinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spSport.adapter = sportSpinnerAdapter


        val minSkillLevelItems = resources.getStringArray(R.array.min_skill_array)
        val minSkillSpinnerAdapter = object : ArrayAdapter<String>(
            requireContext(),
            android.R.layout.simple_spinner_item,
            minSkillLevelItems
        ) {
            override fun isEnabled(position: Int): Boolean {
                // Disable the first item from Spinner
                // First item will be used for hint
                return position != 0
            }

            override fun getDropDownView(
                position: Int,
                convertView: View?,
                parent: ViewGroup
            ): View {
                val view: TextView =
                    super.getDropDownView(position, convertView, parent) as TextView
                //set the color of first item in the drop down list to gray
                if (position == 0) {
                    view.setTextColor(Color.GRAY)
                } else {
                    //here it is possible to define color for other items by
                    //view.setTextColor(Color.RED)
                }
                return view
            }
        }
        minSkillSpinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spMinSkill.adapter = minSkillSpinnerAdapter

        val maxSkillLevelItems = resources.getStringArray(R.array.max_skill_array)
        val maxSkillSpinnerAdapter = object : ArrayAdapter<String>(
            requireContext(),
            android.R.layout.simple_spinner_item,
            maxSkillLevelItems
        ) {
            override fun isEnabled(position: Int): Boolean {
                // Disable the first item from Spinner
                // First item will be used for hint
                return position != 0
            }

            override fun getDropDownView(
                position: Int,
                convertView: View?,
                parent: ViewGroup
            ): View {
                val view: TextView =
                    super.getDropDownView(position, convertView, parent) as TextView
                //set the color of first item in the drop down list to gray
                if (position == 0) {
                    view.setTextColor(Color.GRAY)
                } else {
                    //here it is possible to define color for other items by
                    //view.setTextColor(Color.RED)
                }
                return view
            }
        }
        maxSkillSpinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spMaxSkill.adapter = maxSkillSpinnerAdapter
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setClickListeners() {
        var isStart: Boolean
        binding.ivEventDateStart.setOnClickListener {
            isStart = true
            setDatePickers(isStart)
        }
        binding.ivEventDateEnd.setOnClickListener {
            isStart = false
            setDatePickers(isStart)
        }

        binding.buttonCreateEvent.setOnClickListener {

            context?.run {
                showLoading(this)
            }
            ReboundAPI.create().getUser(token, username).enqueue(object: Callback<UserResponse> {
                override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                    if(response.isSuccessful){
                        val durationMill = endTime.time - startTime.time
                        val durationMinute = durationMill / 60000

                        val request = CreateEventRequest(
                            binding.etEventTitle.text.toString(),
                            binding.etEventDescription.text.toString(),
                            binding.spSport.selectedItem.toString(),
                            binding.etLocationName.text.toString(),
                            binding.etLatitude.text.toString().toFloat(),
                            binding.etLongitude.text.toString().toFloat(),
                            durationMinute,
                            binding.spMinSkill.selectedItem.toString().toInt(),
                            binding.spMaxSkill.selectedItem.toString().toInt(),
                            binding.etMinAge.text.toString().toInt(),
                            binding.etMaxAge.text.toString().toInt(),
                            binding.etPlayerCapacity.text.toString().toInt(),
                            binding.etSpectatorCapacity.text.toString().toInt(),
                            response.body()?.id ?: 0,
                            startTimeIso
                        )

                        ReboundAPI.create().createEvent(token, request).enqueue(object: Callback<CreateEventResponse> {
                            override fun onResponse(
                                call: Call<CreateEventResponse>,
                                response: Response<CreateEventResponse>
                            ) {
                                hideLoading()
                                if(response.isSuccessful){
                                    Toast.makeText(requireContext(),"EVENT CREATION SUCCESSFULLY DONE!", Toast.LENGTH_SHORT).show()
                                }
                            }

                            override fun onFailure(call: Call<CreateEventResponse>, t: Throwable) {
                                hideLoading()
                                Toast.makeText(requireContext(),"AN ERROR OCCURRED, PLEASE TRY AGAIN LATER", Toast.LENGTH_SHORT).show()
                            }

                        })

                    }else{
                        hideLoading()
                    }
                }

                override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                    hideLoading()
                }

            })
        }

        binding.ivMapLatitude.setOnClickListener {
            val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main, FragmentCreateEventMap()).addToBackStack("create-event-map")
            transaction.commit()
        }

        binding.ivMapLongitude.setOnClickListener {
            val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
            transaction.replace(R.id.container_main, FragmentCreateEventMap()).addToBackStack("create-event-map")
            transaction.commit()
        }
    }

    private fun setFragmentListeners(){
        setFragmentResultListener(REQUEST_KEY) { key, bundle ->
            binding.etLatitude.setText(bundle.getFloat(BUNDLE_KEY).toString())
        }
        setFragmentResultListener(REQUEST_KEY_1) { key, bundle ->
            binding.etLongitude.setText(bundle.getFloat(BUNDLE_KEY_1).toString())
        }
    }

    interface FragmentCreateEventListener {
        //TODO: will be implemented later
    }

    companion object {
        const val TAG = "home"
        private const val TOKEN_KEY = "token_key"
        private const val REQUEST_KEY ="request_key"
        private const val REQUEST_KEY_1 ="request_key_1"
        private const val BUNDLE_KEY ="bundle_key"
        private const val BUNDLE_KEY_1 = "bundle_key_1"
        private const val USERNAME_KEY = "username_key"
        private const val TEST_KEY = "test_key"
        fun newInstance(token: String, username: String, testList : ArrayList<String>) = FragmentCreateEvent().apply {
            arguments = Bundle().apply {
                putString(TOKEN_KEY, token)
                putString(USERNAME_KEY, username)
                putStringArrayList(TEST_KEY, testList)
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
