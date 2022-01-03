package com.bounswe.findsportevents.main.fragments

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentGiveABadgeBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.GetBadgesResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Byte.decode
import java.util.*


class FragmentGiveABadge: Fragment() {
    private var _binding: FragmentGiveABadgeBinding? = null
    private val binding get() = _binding!!
    private var token = ""
    private var username = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        token = requireArguments().getString(TOKEN_KEY) ?: ""

    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentGiveABadgeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        ReboundAPI.create().getBadges(token).enqueue(object: Callback<GetBadgesResponse> {
            override fun onResponse(
                call: Call<GetBadgesResponse>,
                response: Response<GetBadgesResponse>
            ) {
                if (response.isSuccessful){
                    val base64String = response.body()?.items?.get(0)?.icon?.content
                    if (!base64String.isNullOrEmpty()){
                        val imageBytes = Base64.decode(base64String, Base64.DEFAULT)
                        val decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                        binding.ivMvp.setImageBitmap(decodedImage)
                    }


                    binding.tvMvpDesc.text = response.body()?.items?.get(0)?.content
                }
            }

            override fun onFailure(call: Call<GetBadgesResponse>, t: Throwable) {
            }

        })


        setClickListeners()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setClickListeners() {
//        TODO("Not yet implemented")
    }

    companion object {
        const val TAG = "UserResult"
        private const val TOKEN_KEY = "token_key"

        fun newInstance(token: String) = FragmentGiveABadge().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
            }
        }
    }
}