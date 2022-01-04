package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R

class RecyclerAdapterSpectators(
    val usernames: MutableList<String>, val favSports: MutableList<String>,
    private val listener: OnItemClickListenerSpectator
) : RecyclerView.Adapter<RecyclerAdapterSpectators.ViewHolder>() {


    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): RecyclerAdapterSpectators.ViewHolder {
        val v = LayoutInflater.from(parent.context)
            .inflate(R.layout.card_view_applications, parent, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterSpectators.ViewHolder, position: Int) {
        holder.username.text = usernames[position]
        holder.favSport.text = favSports[position]

        holder.acceptButton.setOnClickListener {
            listener.onAcceptOrRejectClickedSpectators(true, holder.username.text.toString())
        }
        holder.rejectButton.setOnClickListener {
            listener.onAcceptOrRejectClickedSpectators(false, holder.username.text.toString())
        }
        holder.profileButton.setOnClickListener {
            listener.onProfileClickedSpectators(holder.username.text.toString(), position)
        }
    }

    override fun getItemCount(): Int {
        return favSports.size
    }

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView),
        View.OnClickListener {
        var username: TextView
        var favSport: TextView
        val profileButton: Button
        val acceptButton: Button
        val rejectButton: Button

        init {
            username = itemView.findViewById(R.id.tv_username2)
            favSport = itemView.findViewById(R.id.tv_fav_sport2)
            profileButton = itemView.findViewById(R.id.bt_profile)
            acceptButton = itemView.findViewById(R.id.bt_accept)
            rejectButton = itemView.findViewById(R.id.bt_reject)
        }

        override fun onClick(p0: View?) {
        }
    }

    interface OnItemClickListenerSpectator {
        fun onAcceptOrRejectClickedSpectators(accept: Boolean, username: String)
        fun onProfileClickedSpectators(username: String, position: Int)
    }

}