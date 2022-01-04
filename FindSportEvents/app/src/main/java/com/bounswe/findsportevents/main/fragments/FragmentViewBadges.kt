package com.bounswe.findsportevents.main.fragments

import android.content.Context
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.findsportevents.databinding.FragmentViewBadgesBinding
import com.bounswe.findsportevents.network.ReboundAPI
import com.bounswe.findsportevents.network.modalz.responses.GetBadgesResponse
import com.bounswe.findsportevents.network.modalz.responses.ItemsResponse
import com.bounswe.findsportevents.util.DialogManager
import com.bounswe.findsportevents.util.LoadingDialog
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception


class FragmentViewBadges : Fragment(), DialogManager {
    private var _binding: FragmentViewBadgesBinding? = null
    private val binding get() = _binding!!
    private var dialog: LoadingDialog? = null
    private var token = ""
    private var badgeList: ArrayList<String> = arrayListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        token = requireArguments().getString(TOKEN_KEY) ?: ""
        badgeList = requireArguments().getStringArrayList(BADGE_KEY) ?: arrayListOf()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentViewBadgesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        context?.run {
            showLoading(this)
        }
        for (badgeName in badgeList) {
            ReboundAPI.create().getBadgeByName(token, badgeName).enqueue(object: Callback<ItemsResponse> {
                override fun onResponse(
                    call: Call<ItemsResponse>,
                    response: Response<ItemsResponse>
                ) {
                    hideLoading()
                    if (response.isSuccessful) {
                        if (response.body()?.name == "MVP"){
                            binding.tvName1.visibility = View.VISIBLE
                            binding.tvBadgeDesc1.visibility = View.VISIBLE
                            binding.ivBadge1.visibility = View.VISIBLE

                            binding.tvName1.text = response.body()?.name
                            binding.tvBadgeDesc1.text = response.body()?.content
                            val image1 = response.body()?.icon?.content
                            val imageBytes1 = Base64.decode(image1, Base64.DEFAULT)
                            val decodedImage1 = BitmapFactory.decodeByteArray(imageBytes1, 0, imageBytes1.size)
                            binding.ivBadge1.setImageBitmap(decodedImage1)
                        } else if (response.body()?.name == "Fair play"){
                            binding.tvName2.visibility = View.VISIBLE
                            binding.tvBadgeDesc2.visibility = View.VISIBLE
                            binding.ivBadge2.visibility = View.VISIBLE

                            binding.tvName2.text = response.body()?.name
                            binding.tvBadgeDesc2.text = response.body()?.content
                            val image2 = response.body()?.icon?.content
                            val imageBytes2 = Base64.decode(image2, Base64.DEFAULT)
                            val decodedImage2 = BitmapFactory.decodeByteArray(imageBytes2, 0, imageBytes2.size)
                            binding.ivBadge2.setImageBitmap(decodedImage2)
                        } else if (response.body()?.name == "Friendly"){
                            binding.tvName3.visibility = View.VISIBLE
                            binding.tvBadgeDesc3.visibility = View.VISIBLE
                            binding.ivBadge3.visibility = View.VISIBLE

                            binding.tvName3.text = response.body()?.name
                            binding.tvBadgeDesc3.text = response.body()?.content
                            val image3 = response.body()?.icon?.content
                            val imageBytes3 = Base64.decode(image3, Base64.DEFAULT)
                            val decodedImage3 = BitmapFactory.decodeByteArray(imageBytes3, 0, imageBytes3.size)
                            binding.ivBadge3.setImageBitmap(decodedImage3)
                        } else if (response.body()?.name == "Team leader"){
                            binding.tvName4.visibility = View.VISIBLE
                            binding.tvBadgeDesc4.visibility = View.VISIBLE
                            binding.ivBadge4.visibility = View.VISIBLE

                            binding.tvName4.text = response.body()?.name
                            binding.tvBadgeDesc4.text = response.body()?.content
                            val image4 = response.body()?.icon?.content
                            val imageBytes4 = Base64.decode(image4, Base64.DEFAULT)
                            val decodedImage4 = BitmapFactory.decodeByteArray(imageBytes4, 0, imageBytes4.size)
                            binding.ivBadge4.setImageBitmap(decodedImage4)
                        } else if (response.body()?.name == "Cheater"){
                            binding.tvName5.visibility = View.VISIBLE
                            binding.tvBadgeDesc5.visibility = View.VISIBLE
                            binding.ivBadge5.visibility = View.VISIBLE

                            binding.tvName5.text = response.body()?.name
                            binding.tvBadgeDesc5.text = response.body()?.content
                            val image5 = response.body()?.icon?.content
                            val imageBytes5 = Base64.decode(image5, Base64.DEFAULT)
                            val decodedImage5 = BitmapFactory.decodeByteArray(imageBytes5, 0, imageBytes5.size)
                            binding.ivBadge5.setImageBitmap(decodedImage5)
                        } else if (response.body()?.name == "Aggression"){
                            binding.tvName6.visibility = View.VISIBLE
                            binding.tvBadgeDesc6.visibility = View.VISIBLE
                            binding.ivBadge6.visibility = View.VISIBLE

                            binding.tvName6.text = response.body()?.name
                            binding.tvBadgeDesc6.text = response.body()?.content
                            val image6 = response.body()?.icon?.content
                            val imageBytes6 = Base64.decode(image6, Base64.DEFAULT)
                            val decodedImage6 = BitmapFactory.decodeByteArray(imageBytes6, 0, imageBytes6.size)
                            binding.ivBadge6.setImageBitmap(decodedImage6)
                        }
                    }
                }

                override fun onFailure(call: Call<ItemsResponse>, t: Throwable) {
                    hideLoading()
                }

            })
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    companion object {
        const val TAG = "UserResult"
        private const val TOKEN_KEY = "token_key"
        private const val BADGE_KEY = "badge_key"

        fun newInstance(token: String, badgeList: ArrayList<String>) = FragmentViewBadges().also {
            it.arguments = Bundle().also {
                it.putString(TOKEN_KEY, token)
                it.putStringArrayList(BADGE_KEY, badgeList)
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