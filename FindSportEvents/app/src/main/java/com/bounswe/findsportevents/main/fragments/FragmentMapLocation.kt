package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.preference.PreferenceManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentMapBinding
import com.bounswe.findsportevents.databinding.FragmentMapLocationBinding
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

class FragmentMapLocation : Fragment()  {
    private var token=""
    private var sport=""
    private var minskillLevel=""
    private var maxskillLevel=""
    private var minAge=""
    private var maxAge=""
    private var startTime=""
    private var endTime=""
    private var latitude = 0f
    private var longitude = 0f


    var tapCount=0
    private lateinit var map : MapView;
    private var marker1= GeoPoint(0,0)
    private var marker2= GeoPoint(0,0)
    private var _binding: FragmentMapLocationBinding? = null
    private val binding get() = _binding!!
    private lateinit var mapLocationFragListener : FragmentMapLocationListener
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mapLocationFragListener = requireActivity() as FragmentMapLocationListener
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        latitude = requireArguments().getFloat(LATITUDE_KEY)
        longitude = requireArguments().getFloat(LONGITUDE_KEY)

    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMapLocationBinding.inflate(inflater, container, false)

        Configuration.getInstance().load(context, PreferenceManager.getDefaultSharedPreferences(context));

        map = binding.map
        map.setTileSource(TileSourceFactory.MAPNIK);
        map.setMultiTouchControls(true);
        val mapController = map.controller
        mapController.setZoom(12)
        var istLocation= GeoPoint(latitude.toDouble(),longitude.toDouble())
        mapController.setCenter(istLocation)
        //your items
        val items = ArrayList<OverlayItem>()
        var firstMarker= Marker(map)
        firstMarker.position = istLocation
        map.overlays.add(firstMarker)
        map.invalidate()


//the overlay


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

            requireActivity().supportFragmentManager.popBackStack()
        }


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

    interface FragmentMapLocationListener{
        //
    }
    companion object {
        const val TAG = "MapLocation"
        private const val TOKEN_KEY = "token_key"
        private const val LATITUDE_KEY = "latitude_key"
        private const val LONGITUDE_KEY = "longitude_key"

        fun newInstance(token : String,latitude : Float, longitude:Float) = FragmentMapLocation().apply {
            arguments = Bundle().apply {
                putString(TOKEN_KEY, token)
                putFloat(LATITUDE_KEY, latitude)
                putFloat(LONGITUDE_KEY, longitude)

            }
        }
    }


}