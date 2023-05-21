import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function IconDemo() {
  const [date, setDate] = useState(null);

  return (
    <span className='p-float-label w-[100%]'>
      <Calendar
        inputId='birth_date'
        value={date}
        onChange={(e) => setDate(e.value)}
        showIcon
        yearNavigator={true}
        minDate={new Date()}
        dateFormat='dd/mm/yy'
        yearRange='2023:2050'
      />
      <label htmlFor='birth_date'>Booking Date</label>
    </span>
  );
}
