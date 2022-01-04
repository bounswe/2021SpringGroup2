package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R


class RecyclerAdapterBadges(val events : MutableList<String>,val eventTitles : MutableList<String> ,val creators : MutableList<Int>,
                      val date : MutableList<String>, private val listener: OnItemClickListener) : RecyclerView.Adapter<RecyclerAdapterBadges.ViewHolder>() {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapterBadges.ViewHolder {
        val v=LayoutInflater.from(parent.context).inflate(R.layout.card_view_give_badge,parent,false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterBadges.ViewHolder, position: Int) {
        holder.eventType.text=events[position]
        holder.eventTitle.text=eventTitles[position]
        holder.eventCreator.text=creators[position].toString()
        holder.date.text=date[position]

    }

    override fun getItemCount(): Int {
        return events.size
    }
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView), View.OnClickListener{
        var eventType: TextView
        var eventTitle: TextView
        var eventCreator: TextView
        var date: TextView
        var badgeButton: Button
        init{
            eventType=itemView.findViewById(R.id.event_type_tv)
            eventTitle=itemView.findViewById(R.id.event_title_tv)
            eventCreator=itemView.findViewById(R.id.creator_tv)
            date=itemView.findViewById(R.id.date_tv)
            badgeButton=itemView.findViewById(R.id.bt_give_a_badge)
            badgeButton.setOnClickListener {
                listener.onItemClick(eventCreator.text.toString().toInt())
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
        fun onItemClick(postId: Int)
    }

}