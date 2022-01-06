package com.bounswe.findsportevents.util

import android.content.Context

interface DialogManager {
    fun showLoading(context: Context)
    fun hideLoading()
}