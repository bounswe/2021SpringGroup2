package com.bounswe.findsportevents.main.fragments

import android.graphics.Color
import android.os.Bundle
import android.preference.PreferenceManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.core.app.ActivityCompat
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentResultListener
import androidx.fragment.app.FragmentResultOwner
import androidx.lifecycle.LifecycleOwner
import com.bounswe.findsportevents.R
import com.bounswe.findsportevents.databinding.FragmentMapBinding
import com.bounswe.findsportevents.databinding.FragmentSearchEventBinding
import org.osmdroid.config.Configuration
import org.osmdroid.events.MapEventsReceiver
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.MapEventsOverlay
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.OverlayItem
import org.osmdroid.views.overlay.Polyline
import java.util.ArrayList





class FragmentMap : Fragment()  {
    private var token=""
    private var sport=""
    private var minskillLevel=""
    private var maxskillLevel=""
    private var minAge=""
    private var maxAge=""
    private var startTime=""
    private var endTime=""

    var tapCount=0
    private lateinit var map : MapView;
    private var marker1=GeoPoint(0,0)
    private var marker2=GeoPoint(0,0)
    private var _binding: FragmentMapBinding? = null
    private val binding get() = _binding!!
    private lateinit var mapFragListener : FragmentMapListener
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mapFragListener = requireActivity() as FragmentMapListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMapBinding.inflate(inflater, container, false)

        Configuration.getInstance().load(context, PreferenceManager.getDefaultSharedPreferences(context));

        map = binding.map
        map.setTileSource(TileSourceFactory.MAPNIK);
        map.setMultiTouchControls(true);
        val mapController = map.controller
        mapController.setZoom(12)
        var istLocation=GeoPoint(41.015137,28.979530)
        mapController.setCenter(istLocation)
        //your items
        val items = ArrayList<OverlayItem>()
        var firstMarker=Marker(map)
        var secondMarker=Marker(map)
        var myPath: Polyline = Polyline(map,true,true)

//the overlay
        val receiver = object: MapEventsReceiver {
            override fun singleTapConfirmedHelper(p: GeoPoint?): Boolean {
                if (p != null) {
                    tapCount++

                   // Toast.makeText(context,tapCount.toString(),Toast.LENGTH_SHORT).show()
                    items.add(OverlayItem("Title", "Description", GeoPoint(p)))
                    if(tapCount%2==1){
                        firstMarker.position = p
                        marker1=firstMarker.position
                        map.overlays.add(0,firstMarker)
                        map.invalidate()}
                    if(tapCount%2==0)
                    {
                        secondMarker.position=p
                        map.overlays.add(1,secondMarker)

                        marker2=secondMarker.position
                        map.invalidate()//updating map
                    }

                    //Toast.makeText(context,p.toString(),Toast.LENGTH_SHORT).show()
                }
                checkFields()
                if(tapCount>=2 ){

                    var corner1=GeoPoint(marker1.latitude,marker2.longitude)
                    var corner2=GeoPoint(marker2.latitude,marker1.longitude)
                    myPath.setPoints(listOf(marker1,corner1,marker2,corner2))
                    map.overlays.add(2,myPath)
                    map.invalidate()//updating map
                }
                setClickListeners()

                return false
            }

            override fun longPressHelper(p: GeoPoint?): Boolean {
                return false
            }


        }

        var overlayEvents = MapEventsOverlay(context,receiver)
        map.overlays.add(overlayEvents)

        return binding.root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setObservers()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setObservers() {
  //      TODO("Not yet implemented")
    }

    private fun setClickListeners() {
    binding.btnOk.setOnClickListener {
        val result = marker1
        val result2=marker2

        parentFragmentManager.setFragmentResult(REQUEST_KEY, bundleOf(BUNDLE_KEY to result.latitude.toFloat()))
        parentFragmentManager.setFragmentResult("request_key1", bundleOf("bundle_key1" to result.longitude.toFloat()))
        parentFragmentManager.setFragmentResult("request_key2", bundleOf("bundle_key2" to result2.latitude.toFloat()))
        parentFragmentManager.setFragmentResult("request_key3", bundleOf("bundle_key3" to result2.longitude.toFloat()))
        requireActivity().supportFragmentManager.popBackStack()
    }


    }

    private fun checkFields(){
        binding.btnOk.isEnabled=tapCount>=2

    }
    override fun onResume() {
        super.onResume();
        //this will refresh the osmdroid configuration on resuming.
        //if you make changes to the configuration, use
        //SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        //Configuration.getInstance().load(this, PreferenceManager.getDefaultSharedPreferences(this));

        map.onResume(); //needed for compass, my location overlays, v6.0.0 and up
    }

    override fun onPause() {
        super.onPause();
        //this will refresh the osmdroid configuration on resuming.
        //if you make changes to the configuration, use
        //SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        //Configuration.getInstance().save(this, prefs);
        map.onPause();  //needed for compass, my location overlays, v6.0.0 and up
    }

    interface FragmentMapListener{
        //
    }
    companion object {
        const val TAG = "map"
        private const val TOKEN_KEY = "token_key"
        private const val SPORT_KEY = "sport_key"
        private const val MIN_SKILL_KEY = "min_skill_key"
        private const val MAX_SKILL_KEY = "max_skill_key"
        private const val MIN_AGE_KEY = "min_age_key"
        private const val MAX_AGE_KEY = "max_age_key"
        private const val START_TIME_KEY = "start_time_key"
        private const val END_TIME_KEY = "end_time_key"
        private const val REQUEST_KEY ="request_key"
        private const val BUNDLE_KEY ="bundle_key"
        fun newInstance(token : String,sport: String, minSkill:String,maxSkill:String, min_age:Int, max_age:Int,start_time:String,end_time:String) = FragmentMap().apply {
            arguments = Bundle().apply {
                putString(TOKEN_KEY, token)
                putString(SPORT_KEY, sport)
                putString(MIN_SKILL_KEY, minSkill)
                putString(MAX_SKILL_KEY, maxSkill)
                putInt(MIN_AGE_KEY, min_age)
                putInt(MAX_AGE_KEY, max_age)
                putString(START_TIME_KEY, start_time)
                putString(END_TIME_KEY, end_time)
            }
        }
    }


}

