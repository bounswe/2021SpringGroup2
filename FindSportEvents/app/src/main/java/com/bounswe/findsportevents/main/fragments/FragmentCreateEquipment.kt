package com.bounswe.findsportevents.main.fragments

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
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
import com.bounswe.findsportevents.databinding.FragmentCreateEquipmentBinding
import com.bounswe.findsportevents.databinding.FragmentCreateEventBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.CreateEquipmentRequest
import com.bounswe.findsportevents.network.modalz.requests.CreateEventRequest
import com.bounswe.findsportevents.network.modalz.responses.CreateEventResponse
import com.bounswe.findsportevents.network.modalz.responses.EquipmentbyIdResponse
import com.bounswe.findsportevents.network.modalz.responses.UserResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception
import java.text.SimpleDateFormat
import java.util.*

class FragmentCreateEquipment : Fragment(), DialogManager {
    private var _binding: FragmentCreateEquipmentBinding? = null
    private val binding get() = _binding!!

    private var dialog: LoadingDialog? = null

    private lateinit var createEquipmentListener: FragmentCreateEquipmentListener
    private var token = ""
    private var username = ""
    private var testList= arrayListOf("")



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        createEquipmentListener = requireActivity() as FragmentCreateEquipmentListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        username = requireArguments().getString(USERNAME_KEY) ?: ""
        testList=requireArguments().getStringArrayList(TEST_KEY) ?: arrayListOf("")

        setFragmentListeners()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCreateEquipmentBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setSpinners()
        setClickListeners()
        initListeners()
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
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setClickListeners() {
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
        binding.buttonCreateEvent.setOnClickListener {

            ReboundAPI.create().getUser(token, username).enqueue(object: Callback<UserResponse> {
                override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                    if(response.isSuccessful){


                        val request  = response.body()?.let { it1 ->
                            CreateEquipmentRequest(
                                binding.etEventDescription.text.toString(),
                                binding.etEventTitle.text.toString(),
                                binding.etLocationName.text.toString(),
                                binding.spSport.selectedItem.toString(),
                                binding.etLatitude.text.toString().toFloat(),
                                binding.etLongitude.text.toString().toFloat(),
                                it1.id,
                                binding.etEquipmentType.text.toString(),
                                binding.etUrl.text.toString()
                            )
                        }

                        if (request != null) {
                            ReboundAPI.create().createEquipment(token, request).enqueue(object: Callback<EquipmentbyIdResponse> {
                                override fun onResponse(
                                    call: Call<EquipmentbyIdResponse>,
                                    response: Response<EquipmentbyIdResponse>
                                ) {
                                    hideLoading()
                                    if(response.isSuccessful){
                                        Toast.makeText(requireContext(),"EQUIPMENT CREATION SUCCESSFULLY DONE!", Toast.LENGTH_SHORT).show()
                                    }
                                }

                                override fun onFailure(call: Call<EquipmentbyIdResponse>, t: Throwable) {
                                    hideLoading()
                                    Toast.makeText(requireContext(),"AN ERROR OCCURRED, PLEASE TRY AGAIN LATER", Toast.LENGTH_SHORT).show()
                                }

                            })
                        }

                    }else{
                        hideLoading()
                    }
                }

                override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                    hideLoading()
                }

            })
        }
    }
    private fun initListeners() {
        binding.etEventTitle.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etLocationName.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etLatitude.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etLongitude.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })

    }
    private fun checkFields(){
        binding.buttonCreateEvent.isEnabled=binding.etEventTitle.text.toString().length>=5 && binding.etLocationName.text.toString().length>=5
                && binding.etLatitude.text.toString().length>=1 && binding.etLongitude.text.toString().length>=1
    }

    private fun setFragmentListeners(){
        setFragmentResultListener(REQUEST_KEY) { key, bundle ->
            binding.etLatitude.setText(bundle.getFloat(BUNDLE_KEY).toString())
        }
        setFragmentResultListener(REQUEST_KEY_1) { key, bundle ->
            binding.etLongitude.setText(bundle.getFloat(BUNDLE_KEY_1).toString())
        }
    }

    interface FragmentCreateEquipmentListener {
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
        fun newInstance(token: String, username: String, testList : ArrayList<String>) = FragmentCreateEquipment().apply {
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
