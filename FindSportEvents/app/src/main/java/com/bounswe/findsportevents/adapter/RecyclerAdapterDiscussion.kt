package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R

class RecyclerAdapterDiscussion(val usernames : MutableList<String>,val contents:MutableList<String>, val creationDates: MutableList<String>,
                          private val listener: OnItemClickListener) : RecyclerView.Adapter<RecyclerAdapterDiscussion.ViewHolder>() {



    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapterDiscussion.ViewHolder {
        val v= LayoutInflater.from(parent.context).inflate(R.layout.card_view_discussion,parent,false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterDiscussion.ViewHolder, position: Int) {
        holder.username.text=usernames[position]
        holder.comment.text=contents[position]
        holder.creationDate.text=creationDates[position]

    }

    override fun getItemCount(): Int {
        return usernames.size
    }
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView), View.OnClickListener{
        var username: TextView
        var comment: TextView
        var creationDate : TextView

        init{
            username=itemView.findViewById(R.id.tv_username)
            comment=itemView.findViewById(R.id.tv_comment)
            creationDate=itemView.findViewById(R.id.tv_creation_date)
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