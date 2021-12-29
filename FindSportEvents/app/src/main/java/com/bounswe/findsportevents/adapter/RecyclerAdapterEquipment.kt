package com.bounswe.findsportevents.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.findsportevents.R

class RecyclerAdapterEquipment(val titles : MutableList<String>,
                                private val listener: OnItemClickListener) : RecyclerView.Adapter<RecyclerAdapterEquipment.ViewHolder>() {



    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerAdapterEquipment.ViewHolder {
        val v= LayoutInflater.from(parent.context).inflate(R.layout.card_view_equipment,parent,false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(holder: RecyclerAdapterEquipment.ViewHolder, position: Int) {

    }

    override fun getItemCount(): Int {
        return titles.size
    }
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView), View.OnClickListener{
        var title : TextView

        init{
            title=itemView.findViewById(R.id.tv_title_card)
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