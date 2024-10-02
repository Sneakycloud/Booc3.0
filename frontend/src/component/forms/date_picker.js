import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function BasicDatePicker({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

        <DatePicker 
          value={value}                                 //passes the selected date
          onChange={onChange}                           //handles the date change
          sx={{ backgroundColor: '#ffffffff' }} 
        />

    </LocalizationProvider>
  );
}
