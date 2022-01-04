package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R

class RecyclerAdapterUser(val usernames : MutableList<String>,val favSports:MutableList<String>,
                          private val listener: OnItemClickListener) : RecyclerView.Adapter<RecyclerAdapterUser.ViewHolder>() {



    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapterUser.ViewHolder {
        val v= LayoutInflater.from(parent.context).inflate(R.layout.card_view_user,parent,false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterUser.ViewHolder, position: Int) {
        holder.username.text=usernames[position]
        holder.favSport.text=favSports[position]

    }

    override fun getItemCount(): Int {
        return favSports.size
    }
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView), View.OnClickListener{
        var username: TextView
        var favSport: TextView

        init{
            username=itemView.findViewById(R.id.tv_username2)
            favSport=itemView.findViewById(R.id.tv_fav_sport2)
            itemView.setOnClickListener(this)
        }

        override fun onClick(p0: View?) {
            val position = adapterPosition
            if(position!= RecyclerView.NO_POSITION){
                listener.onItemClick(position)
            }
        }
    }
    interface OnItemClickListener{
        fun onItemClick(position: Int)
    }

}