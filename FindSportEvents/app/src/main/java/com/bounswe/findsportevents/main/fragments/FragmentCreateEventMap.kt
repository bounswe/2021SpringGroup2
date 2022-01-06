package com.bounswe.findsportevents.main.fragments

import android.os.Bundle
import android.preference.PreferenceManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentMapBinding
import org.osmdroid.config.Configuration
import org.osmdroid.events.MapEventsReceiver
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.MapEventsOverlay
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.OverlayItem
import java.util.ArrayList


class FragmentCreateEventMap : Fragment() {

    private lateinit var map: MapView;
    private var marker1 = GeoPoint(0, 0)
    private var latitude =0.0
    private var longitude =0.0
    private var _binding: FragmentMapBinding? = null
    private val binding get() = _binding!!

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMapBinding.inflate(inflater, container, false)

        Configuration.getInstance()
            .load(context, PreferenceManager.getDefaultSharedPreferences(context));

        binding.btnOk.isEnabled = true
        map = binding.map
        map.setTileSource(TileSourceFactory.MAPNIK);
        map.setMultiTouchControls(true);
        val mapController = map.controller
        mapController.setZoom(12)
        var istLocation = GeoPoint(41.015137, 28.979530)
        mapController.setCenter(istLocation)
        //your items
        val items = ArrayList<OverlayItem>()
        var firstMarker = Marker(map)

        //the overlay
        val receiver = object : MapEventsReceiver {
            override fun singleTapConfirmedHelper(p: GeoPoint?): Boolean {
                if (p != null) {
                    items.add(OverlayItem("Title", "Description", GeoPoint(p)))

                    firstMarker.position = p
                    marker1 = firstMarker.position
                    map.overlays.add(firstMarker)
                    map.invalidate()

                    Toast.makeText(context,p.toString(),Toast.LENGTH_SHORT).show()
                }
                return false
            }

            override fun longPressHelper(p: GeoPoint?): Boolean {
                return false
            }


        }

        var overlayEvents = MapEventsOverlay(context, receiver)
        map.overlays.add(overlayEvents)

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setClickListeners()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setClickListeners() {
        binding.btnOk.setOnClickListener {
            val result = marker1

            parentFragmentManager.setFragmentResult(
                REQUEST_KEY,
                bundleOf(BUNDLE_KEY to result.latitude.toFloat())
            )
            parentFragmentManager.setFragmentResult(
                REQUEST_KEY_1,
                bundleOf(BUNDLE_KEY_1 to result.longitude.toFloat())
            )
            requireActivity().supportFragmentManager.popBackStack()
        }
        binding.btnGo.setOnClickListener {
            Toast.makeText(context,"clicked",Toast.LENGTH_SHORT).show()
            map = binding.map
            map.setTileSource(TileSourceFactory.MAPNIK);
            map.setMultiTouchControls(true);
            val mapController = map.controller
            mapController.setZoom(12)
            latitude=binding.etLatitude.text.toString().toDouble()
            longitude=binding.etLongitude.text.toString().toDouble()
            var istLocation=GeoPoint(latitude,longitude)
            mapController.setCenter(istLocation)
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

    interface FragmentMapListener {
        //
    }

    companion object {
        private const val REQUEST_KEY = "request_key"
        private const val REQUEST_KEY_1 = "request_key_1"
        private const val BUNDLE_KEY = "bundle_key"
        private const val BUNDLE_KEY_1 = "bundle_key_1"
    }


}

