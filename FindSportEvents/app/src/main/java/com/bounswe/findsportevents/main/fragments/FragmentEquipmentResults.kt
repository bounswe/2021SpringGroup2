package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.adapter.RecyclerAdapter
import com.bounswe.findsportevents.adapter.RecyclerAdapter2
import com.bounswe.findsportevents.adapter.RecyclerAdapterEquipment
import com.bounswe.findsportevents.databinding.FragmentEquipmentResultsBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.AllEquipmentsResponse
import com.bounswe.findsportevents.network.modalz.responses.AllEventsResponse
import com.bounswe.findsportevents.network.modalz.responses.EquipmentResponse
import com.bounswe.findsportevents.network.modalz.responses.EquipmentbyIdResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception

class FragmentEquipmentResults : Fragment(), RecyclerAdapterEquipment.OnItemClickListener, DialogManager {
    private var _binding: FragmentEquipmentResultsBinding? = null
    private val binding get() = _binding!!
    private var listener : RecyclerAdapterEquipment.OnItemClickListener = this
    private var layoutManager: RecyclerView.LayoutManager?=null
    private var adapter: RecyclerView.Adapter<RecyclerAdapterEquipment.ViewHolder>?=null
    private var token = ""
    private var sport = ""
    private var dialog: LoadingDialog? = null
    var contents : MutableList<String> = mutableListOf()
    var titles : MutableList<String> = mutableListOf()
    var equipmentIds: MutableList<Int> = mutableListOf()
    var events : MutableList<String> = mutableListOf()
    var creators:MutableList<Int> = mutableListOf()
    var fields:MutableList<String> = mutableListOf()
    var players:MutableList<Int> = mutableListOf()
    var spectators:MutableList<Int> = mutableListOf()
    var date:MutableList<String> = mutableListOf()
    var empList : MutableList<Int> = mutableListOf(0)
    var eventList = mutableListOf(2,3,4)
    var next = false
    private lateinit var equipmentResultsFragListener: FragmentEquipmentResultsListener

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        equipmentResultsFragListener = requireActivity() as FragmentEquipmentResultsListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        sport = requireArguments().getString(SPORT_KEY) ?: ""
        var page=1
        context?.run {
            showLoading(this)
        }
        ReboundAPI.create().getEquipments(token,sport).enqueue(object :
            Callback<AllEquipmentsResponse> {

            override fun onResponse(
                call: Call<AllEquipmentsResponse>,
                response: Response<AllEquipmentsResponse>
            ) {
                hideLoading()
                if (response.isSuccessful) {

                    for(i in 0 until (response.body()?.results?.size!!)){
                        equipmentIds.add(response.body()!!.results.get(i).id)
                        titles.add(response.body()!!.results.get(i).title)
                    }
                    layoutManager= LinearLayoutManager(context)
                    binding.recyclerViewEquipment.layoutManager=layoutManager
                    adapter = RecyclerAdapterEquipment(titles,listener)
                    binding.recyclerViewEquipment.adapter = adapter
                    if(page*1.0 < response.body()?.count!!/10.0){
                        page++
                        ReboundAPI.create().getEquipments(token,sport).enqueue(object :
                            Callback<AllEquipmentsResponse> {

                            override fun onResponse(
                                call: Call<AllEquipmentsResponse>,
                                response: Response<AllEquipmentsResponse>
                            ) {
                                hideLoading()
                                if (response.isSuccessful) {

                                    for(i in 0 until (response.body()?.results?.size!!)){

                                    }
                                    layoutManager= LinearLayoutManager(context)
                                    binding.recyclerViewEquipment.layoutManager=layoutManager
                                    adapter = RecyclerAdapterEquipment(titles,listener)
                                    binding.recyclerViewEquipment.adapter = adapter

                                }
                            }

                            override fun onFailure(call: Call<AllEquipmentsResponse>, t: Throwable) {
                                //
                            }
                        }
                        )
                    }
                }
            }

            override fun onFailure(call: Call<AllEquipmentsResponse>, t: Throwable) {
                //
            }
        }
        )




    }
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {


        _binding = FragmentEquipmentResultsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
        setObservers()

    }

    private fun setObservers() {
//        TODO("Not yet implemented")
    }

    private fun setClickListeners() {
//        TODO("Not yet implemented")
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
    override fun onItemClick(position: Int) {
        val transaction: FragmentTransaction =parentFragmentManager.beginTransaction()
        transaction.replace(R.id.container_main,FragmentEquipmentDetailed.newInstance(token,equipmentIds[position])).addToBackStack("eqiupmentresult")
        transaction.commit()
    }

    interface FragmentEquipmentResultsListener{
        //        TODO("Not yet implemented")
    }
    companion object {
        const val TAG = "view all events"
        private const val TOKEN_KEY = "token_key"
        private const val SPORT_KEY = "sport_key"

        fun newInstance(token: String,sport: String) = FragmentEquipmentResults().also {
            it.arguments= Bundle().also {
                it.putString(TOKEN_KEY,token)
                it.putString(SPORT_KEY,sport)
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