package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R

class RecyclerAdapterApplications(
    val usernames: MutableList<String>, val favSports: MutableList<String>,
    private val listener: OnItemClickListener
) : RecyclerView.Adapter<RecyclerAdapterApplications.ViewHolder>() {


    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): RecyclerAdapterApplications.ViewHolder {
        val v = LayoutInflater.from(parent.context)
            .inflate(R.layout.card_view_applications, parent, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterApplications.ViewHolder, position: Int) {
        holder.username.text = usernames[position]
        holder.favSport.text = favSports[position]

        holder.acceptButton.setOnClickListener {
            listener.onAcceptOrRejectClickedPlayers(true, holder.username.text.toString())
        }
        holder.rejectButton.setOnClickListener {
            listener.onAcceptOrRejectClickedPlayers(false, holder.username.text.toString())
        }
        holder.profileButton.setOnClickListener {
            listener.onProfileClickedPlayers(holder.username.text.toString(), position)
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

    interface OnItemClickListener {
        fun onAcceptOrRejectClickedPlayers(accept: Boolean, username: String)
        fun onProfileClickedPlayers(username: String, position: Int)
    }

}