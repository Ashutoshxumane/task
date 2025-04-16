import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { Button, Row, Col } from 'react-bootstrap';

const CustomDateRangePicker = ({ onDateRangeSelect }) => {
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
    selecting: 'start'
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mode, setMode] = useState('range'); // 'single' or 'range'

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "yyyy-MM-dd";
  const rows = [];

  let daysInMonth = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isSelected = selectedRange.start && selectedRange.end && 
        day >= selectedRange.start && day <= selectedRange.end;
      const isStart = selectedRange.start && isSameDay(day, selectedRange.start);
      const isEnd = selectedRange.end && isSameDay(day, selectedRange.end);
      const isInRange = selectedRange.start && selectedRange.end && 
        day > selectedRange.start && day < selectedRange.end;
      const isCurrentDay = isToday(day);
      const isOtherMonth = format(day, 'M') !== format(currentMonth, 'M');

      daysInMonth.push(
        <div
          key={formattedDate}
          className={`
            p-0 d-flex justify-content-center align-items-center position-relative
            ${isSelected ? 'bg-primary text-white' : ''}
            ${isStart ? 'rounded-start bg-primary text-white' : ''}
            ${isEnd ? 'rounded-end bg-primary text-white' : ''}
            ${isInRange ? 'bg-primary bg-opacity-10' : ''}
            ${isOtherMonth ? 'text-muted opacity-50' : ''}
            ${isCurrentDay && !isSelected ? 'border border-primary' : ''}
          `}
          onClick={() => handleDateClick(cloneDay)}
          style={{ 
            width: '24px', 
            height: '24px', 
            cursor: 'pointer',
            fontSize: '10px',
            transition: 'all 0.2s',
            borderRadius: '4px',
            margin: '1px'
          }}
        >
          {format(day, 'd')}
          {isCurrentDay && !isSelected && !isStart && !isEnd && (
            <span className="position-absolute" style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: '#0d6efd',
              bottom: '2px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}></span>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={formattedDate} className="d-flex justify-content-center">
        {daysInMonth}
      </div>
    );
    daysInMonth = [];
  }

  const normalizeDate = (date) => {
    // Create a new date and set to start of day to avoid timezone issues
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const handleDateClick = (day) => {
    // Normalize the date to avoid timezone issues
    const normalizedDay = normalizeDate(day);
    
    if (mode === 'single') {
      // In single mode, just set both start and end to the same date
      setSelectedRange({
        start: normalizedDay,
        end: normalizedDay,
        selecting: 'start'
      });
    } else {
      // Range mode behavior
      if (selectedRange.selecting === 'start') {
        setSelectedRange({
          start: normalizedDay,
          end: normalizedDay,
          selecting: 'end'
        });
      } else {
        if (normalizedDay < selectedRange.start) {
          setSelectedRange({
            start: normalizedDay,
            end: selectedRange.start,
            selecting: 'start'
          });
        } else {
          setSelectedRange({
            ...selectedRange,
            end: normalizedDay,
            selecting: 'start'
          });
        }
      }
    }
  };

  const handleClear = () => {
    setSelectedRange({
      start: null,
      end: null,
      selecting: 'start'
    });
    onDateRangeSelect(null, null);
  };

  const handleSubmit = () => {
    if (selectedRange.start && selectedRange.end) {
      onDateRangeSelect(selectedRange.start, selectedRange.end);
    }
  };
  
  // Predefined date ranges
  const selectToday = () => {
    const today = normalizeDate(new Date());
    setSelectedRange({
      start: today,
      end: today,
      selecting: 'start'
    });
    onDateRangeSelect(today, today);
  };

  const selectLastSevenDays = () => {
    setMode('range');
    const end = normalizeDate(new Date());
    const start = normalizeDate(addDays(end, -6));
    setSelectedRange({
      start,
      end,
      selecting: 'start'
    });
    onDateRangeSelect(start, end);
  };

  const selectThisMonth = () => {
    setMode('range');
    const today = new Date();
    const monthStart = normalizeDate(startOfMonth(today));
    const monthEnd = normalizeDate(endOfMonth(today));
    setSelectedRange({
      start: monthStart,
      end: monthEnd,
      selecting: 'start'
    });
    onDateRangeSelect(monthStart, monthEnd);
  };

  return (
    <div className="bg-white rounded shadow border" style={{ width: '200px' }}>
      <div className="d-flex justify-content-between align-items-center p-1 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
        <Button
          variant="light"
          size="sm"
          className="border-0 p-0"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{ fontSize: '10px', width: '20px', height: '20px' }}
        >
          <i className="bi bi-chevron-left"></i>
        </Button>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#546e7a' }}>
          {format(currentMonth, 'MMM yyyy')}
        </span>
        <Button
          variant="light"
          size="sm"
          className="border-0 p-0"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          style={{ fontSize: '10px', width: '20px', height: '20px' }}
        >
          <i className="bi bi-chevron-right"></i>
        </Button>
      </div>

      <div className="d-flex justify-content-center align-items-center py-1 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
        <Button
          variant={mode === 'single' ? 'primary' : 'light'}
          size="sm"
          className="py-0 px-1 me-1"
          style={{ fontSize: '9px', borderRadius: '4px' }}
          onClick={() => setMode('single')}
        >
          Single Day
        </Button>
        <Button
          variant={mode === 'range' ? 'primary' : 'light'}
          size="sm"
          className="py-0 px-1"
          style={{ fontSize: '9px', borderRadius: '4px' }}
          onClick={() => setMode('range')}
        >
          Date Range
        </Button>
      </div>

      <div className="px-1 pt-1">
        <Row className="g-0 mb-1 justify-content-center">
          {days.map(day => (
            <Col key={day} className="text-center p-0" style={{ width: '24px', margin: '1px' }}>
              <div style={{ fontSize: '9px', fontWeight: '600', color: '#546e7a' }}>{day}</div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="px-1 pb-1">
        {rows.map((row, index) => (
          <Row key={index} className="g-0 justify-content-center">
            {row}
          </Row>
        ))}
      </div>
      
      <div className="d-flex flex-wrap px-1 pb-1" style={{ gap: '4px' }}>
        <Button 
          variant="light" 
          size="sm" 
          className="py-0 px-1" 
          style={{ fontSize: '9px', borderRadius: '4px' }}
          onClick={selectToday}
        >
          Today
        </Button>
        <Button 
          variant="light" 
          size="sm" 
          className="py-0 px-1" 
          style={{ fontSize: '9px', borderRadius: '4px' }}
          onClick={selectLastSevenDays}
        >
          Last 7d
        </Button>
        <Button 
          variant="light" 
          size="sm" 
          className="py-0 px-1" 
          style={{ fontSize: '9px', borderRadius: '4px' }}
          onClick={selectThisMonth}
        >
          This Month
        </Button>
      </div>

      <div className="d-flex justify-content-between p-1 border-top" style={{ backgroundColor: '#f8f9fa' }}>
        <Button
          variant="outline-secondary"
          size="sm"
          className="py-0 px-2"
          style={{ fontSize: '10px', height: '20px' }}
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="py-0 px-2"
          style={{ fontSize: '10px', height: '20px' }}
          onClick={handleSubmit}
          disabled={!selectedRange.start || !selectedRange.end}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default CustomDateRangePicker; 