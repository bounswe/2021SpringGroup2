package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentGiveABadgeBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.requests.GiveBadgeRequest
import com.bounswe.findsportevents.network.modalz.responses.GetBadgesResponse
import com.bounswe.findsportevents.network.modalz.responses.GiveBadgeResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Byte.decode
import java.lang.Exception
import java.util.*


class FragmentGiveABadge : Fragment(), DialogManager {
    private var _binding: FragmentGiveABadgeBinding? = null
    private val binding get() = _binding!!
    private var dialog: LoadingDialog? = null
    private var token = ""
    private var username = ""
    private var postId = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        postId = requireArguments().getInt(POST_ID_KEY)
        username = requireArguments().getString(USERNAME_KEY) ?: ""

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

        context?.run {
            showLoading(this)
        }
        ReboundAPI.create().getBadges(token).enqueue(object : Callback<GetBadgesResponse> {
            override fun onResponse(
                call: Call<GetBadgesResponse>,
                response: Response<GetBadgesResponse>
            ) {
                hideLoading()
                if (response.isSuccessful) {
                    val image1 = response.body()?.items?.get(0)?.icon?.content
                    val image2 = response.body()?.items?.get(1)?.icon?.content
                    val image3 = response.body()?.items?.get(2)?.icon?.content
                    val image4 = response.body()?.items?.get(3)?.icon?.content
                    val image5 = response.body()?.items?.get(4)?.icon?.content
                    val image6 = response.body()?.items?.get(5)?.icon?.content
                    if (!image1.isNullOrEmpty() || image2.isNullOrEmpty() || image3.isNullOrEmpty() || image4.isNullOrEmpty() || image5.isNullOrEmpty() || image6.isNullOrEmpty()) {
                        val imageBytes1 = Base64.decode(image1, Base64.DEFAULT)
                        val imageBytes2 = Base64.decode(image2, Base64.DEFAULT)
                        val imageBytes3 = Base64.decode(image3, Base64.DEFAULT)
                        val imageBytes4 = Base64.decode(image4, Base64.DEFAULT)
                        val imageBytes5 = Base64.decode(image5, Base64.DEFAULT)
                        val imageBytes6 = Base64.decode(image6, Base64.DEFAULT)
                        val decodedImage1 =
                            BitmapFactory.decodeByteArray(imageBytes1, 0, imageBytes1.size)
                        val decodedImage2 =
                            BitmapFactory.decodeByteArray(imageBytes2, 0, imageBytes2.size)
                        val decodedImage3 =
                            BitmapFactory.decodeByteArray(imageBytes3, 0, imageBytes3.size)
                        val decodedImage4 =
                            BitmapFactory.decodeByteArray(imageBytes4, 0, imageBytes4.size)
                        val decodedImage5 =
                            BitmapFactory.decodeByteArray(imageBytes5, 0, imageBytes5.size)
                        val decodedImage6 =
                            BitmapFactory.decodeByteArray(imageBytes6, 0, imageBytes6.size)
                        binding.ivBadge1.setImageBitmap(decodedImage1)
                        binding.ivBadge2.setImageBitmap(decodedImage2)
                        binding.ivBadge3.setImageBitmap(decodedImage3)
                        binding.ivBadge4.setImageBitmap(decodedImage4)
                        binding.ivBadge5.setImageBitmap(decodedImage5)
                        binding.ivBadge6.setImageBitmap(decodedImage6)
                    }

                    binding.tvBadgeDesc1.text = response.body()?.items?.get(0)?.content
                    binding.tvBadgeDesc2.text = response.body()?.items?.get(1)?.content
                    binding.tvBadgeDesc3.text = response.body()?.items?.get(2)?.content
                    binding.tvBadgeDesc4.text = response.body()?.items?.get(3)?.content
                    binding.tvBadgeDesc5.text = response.body()?.items?.get(4)?.content
                    binding.tvBadgeDesc6.text = response.body()?.items?.get(5)?.content

                    binding.tvName1.text = response.body()?.items?.get(0)?.name
                    binding.tvName2.text = response.body()?.items?.get(1)?.name
                    binding.tvName3.text = response.body()?.items?.get(2)?.name
                    binding.tvName4.text = response.body()?.items?.get(3)?.name
                    binding.tvName5.text = response.body()?.items?.get(4)?.name
                    binding.tvName6.text = response.body()?.items?.get(5)?.name
                }
            }

            override fun onFailure(call: Call<GetBadgesResponse>, t: Throwable) {
                hideLoading()
            }

        })


        setClickListeners()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun setClickListeners() {
        binding.btGiveBadge1.setOnClickListener {
            val request = GiveBadgeRequest(
                binding.tvName1.text.toString(),
                postId
            )
            giveBadge(request)
        }
        binding.btGiveBadge2.setOnClickListener {
            val request = GiveBadgeRequest(
                binding.tvName2.text.toString(),
                postId
            )
            giveBadge(request)
        }
        binding.btGiveBadge3.setOnClickListener {
            val request = GiveBadgeRequest(
                binding.tvName3.text.toString(),
                postId
            )
            giveBadge(request)
        }
        binding.btGiveBadge4.setOnClickListener {
            val request = GiveBadgeRequest(
                binding.tvName4.text.toString(),
                postId
            )
            giveBadge(request)
        }
        binding.btGiveBadge5.setOnClickListener {
            val request = GiveBadgeRequest(
                binding.tvName5.text.toString(),
                postId
            )
            giveBadge(request)
        }
        binding.btGiveBadge6.setOnClickListener {
            val request = GiveBadgeRequest(
                binding.tvName6.text.toString(),
                postId
            )
            giveBadge(request)
        }
    }

    private fun giveBadge(request: GiveBadgeRequest) {
        ReboundAPI.create().giveABadge(token, username, request).enqueue(object: Callback<GiveBadgeResponse> {
            override fun onResponse(
                call: Call<GiveBadgeResponse>,
                response: Response<GiveBadgeResponse>
            ) {
                if(response.isSuccessful){
                    Toast.makeText(requireContext(), response.body()?.summary ?: "", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<GiveBadgeResponse>, t: Throwable) {
            }

        })
    }

    companion object {
        const val TAG = "UserResult"
        private const val TOKEN_KEY = "token_key"
        private const val POST_ID_KEY = "post_id_key"
        private const val USERNAME_KEY = "username_key"

        fun newInstance(token: String, postId: Int, username: String) = FragmentGiveABadge().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putInt(POST_ID_KEY, postId)
                it.putString(USERNAME_KEY, username)
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