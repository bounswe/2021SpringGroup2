package com.bounswe.findsportevents.login

import android.app.DatePickerDialog
import android.os.Bundle
import android.text.Editable
import android.text.TextUtils
import android.text.TextWatcher
import android.util.Patterns
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.findsportevents.databinding.ActivitySignupBinding
import java.text.SimpleDateFormat
import java.util.*

class SignupActivity: AppCompatActivity() {
    private lateinit var binding: ActivitySignupBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)
        initListeners()
    }
    private fun initListeners(){
        binding.etUsername.addTextChangedListener(object: TextWatcher{
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etPassword.addTextChangedListener(object: TextWatcher{
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etPasswordConfirm.addTextChangedListener(object: TextWatcher{
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etName.addTextChangedListener(object: TextWatcher{
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.tvBirthDate.addTextChangedListener(object: TextWatcher{
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.etMail.addTextChangedListener(object: TextWatcher{
            override fun beforeTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun onTextChanged(p0: CharSequence?, p1: Int, p2: Int, p3: Int) {
            }

            override fun afterTextChanged(p0: Editable?) {
                checkFields()
            }
        })
        binding.btnDatePicker.setOnClickListener{View -> clickDatePicker(View)}
    }
    private fun checkFields(){
        binding.buttonSignup.isEnabled=binding.etUsername.text.toString().length >= 5 && binding.etPassword.text.toString().length >= 5
                && binding.etPasswordConfirm.text.toString() == binding.etPassword.text.toString() && binding.etName.text.toString()
            .isNotEmpty() && binding.tvBirthDate.text.toString().isNotEmpty() && isValidEmail(binding.etMail.text.toString())
    }
    private fun isValidEmail(email: String): Boolean {
        return !TextUtils.isEmpty(email) && Patterns.EMAIL_ADDRESS.matcher(email).matches()
    }
    private fun clickDatePicker(view: View){
        var myCalendar = Calendar.getInstance()
        val year=myCalendar.get(Calendar.YEAR)
        val month=myCalendar.get(Calendar.MONTH)
        val day=myCalendar.get(Calendar.DAY_OF_MONTH)
        DatePickerDialog(this,
            DatePickerDialog.OnDateSetListener { view, SelectedYear, SelectedMonth, SelectedDayOfMonth ->
            Toast.makeText(this,"The selected date is ${SelectedDayOfMonth}/${SelectedMonth+1}/${SelectedYear}",Toast.LENGTH_LONG).show()
            val selectedDate="$SelectedDayOfMonth/${SelectedMonth+1}/$SelectedYear"
            val sdf = SimpleDateFormat("dd/MM/yyyy", Locale.ENGLISH)
            val theDate = sdf.parse(selectedDate)
                binding.tvBirthDate.text = theDate.toString()


        }
            ,year
            ,month
            ,day).show()
    }
}