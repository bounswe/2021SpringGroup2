package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R


class RecyclerAdapterBadges(val events : MutableList<String>,val creators : MutableList<Int>
                      ,val fields : MutableList<String>,val players : MutableList<Int>,val spectators : MutableList<Int>,
                      val date : MutableList<String>, private val listener: OnItemClickListener) : RecyclerView.Adapter<RecyclerAdapterBadges.ViewHolder>() {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapterBadges.ViewHolder {
        val v=LayoutInflater.from(parent.context).inflate(R.layout.card_view_give_badge,parent,false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterBadges.ViewHolder, position: Int) {
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
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView), View.OnClickListener{
        var eventType: TextView
        var eventCreator: TextView
        var field: TextView
        var players: TextView
        var date: TextView
        var spectators: TextView
        var badgeButton: Button
        init{
            eventType=itemView.findViewById(R.id.event_type_tv)
            eventCreator=itemView.findViewById(R.id.creator_tv)
            field=itemView.findViewById(R.id.field_tv)
            players=itemView.findViewById(R.id.players_tv)
            date=itemView.findViewById(R.id.date_tv)
            spectators=itemView.findViewById(R.id.spectators_tv)
            badgeButton=itemView.findViewById(R.id.bt_give_a_badge)
            badgeButton.setOnClickListener {
                listener.onItemClick()
            }
            itemView.setOnClickListener(this)
        }

        override fun onClick(p0: View?) {
//            val position = adapterPosition
//            if(position!=RecyclerView.NO_POSITION){
//                listener.onItemClick(position)
//            }
        }
    }
    interface OnItemClickListener{
        fun onItemClick()
    }

}