package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R


class RecyclerAdapter2(val events : MutableList<String>,val creators : MutableList<Int>
                      ,val fields : MutableList<String>,val players : MutableList<Int>,val spectators : MutableList<Int>,
                      val date : MutableList<String>) : RecyclerView.Adapter<RecyclerAdapter2.ViewHolder>() {



    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapter2.ViewHolder {
        val v=LayoutInflater.from(parent.context).inflate(R.layout.card_view,parent,false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapter2.ViewHolder, position: Int) {
        holder.eventType.text=events[position]
        holder.eventCreator.text=creators[position].toString()
        holder.field.text=fields[position]
        holder.players.text=players[position].toString()
        holder.spectators.text=spectators[position].toString()
        holder.date.text=date[position]

    }

    override fun getItemCount(): Int {
        return events.size
    }
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var eventType: TextView
        var eventCreator: TextView
        var field: TextView
        var players: TextView
        var date: TextView
        var spectators: TextView
        init{
            eventType=itemView.findViewById(R.id.event_type_tv)
            eventCreator=itemView.findViewById(R.id.creator_tv)
            field=itemView.findViewById(R.id.field_tv)
            players=itemView.findViewById(R.id.players_tv)
            date=itemView.findViewById(R.id.date_tv)
            spectators=itemView.findViewById(R.id.spectators_tv)

        }
    }
}