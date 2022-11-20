import { Form, useSearchParams } from '@remix-run/react';
import React from 'react';
import { Airport } from '@prisma/client';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface SearchFormProps {
  airports: Airport[];
}

export function SearchForm({ airports }: SearchFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [adults, setAdults] = React.useState(0);
  const [children, setChildren] = React.useState(0);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [selectedAirports, setSelectedAirports] = React.useState<Airport[]>([]);

  const clearForm = () => {
    setSearchParams({}, { replace: true });
    setAdults(0)
    setChildren(0)
    setStartDate('')
    setEndDate('')
    setSelectedAirports([])
  };

  React.useEffect(() => {
    const departuredate = searchParams.get('departureDate');
    const returndate = searchParams.get('returnDate');
    const countadults = searchParams.get('adults');
    const countchildren = searchParams.get('children');

    if (departuredate) {
      setStartDate(departuredate)
    }

    if (returndate) {
      setEndDate(returndate)
    }

    if (countadults) {
      setAdults(Number(countadults))
    }

    if (countchildren) {
      setChildren(Number(countchildren))
    }

  }, [])

  return (
    <Form method="get">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: '1rem',
        }}
      >
        <DatePicker
          label="Departure Date"
          mask="____/__/__"
          value={startDate}
          onChange={(value) => setStartDate(value ? value : '')}
          renderInput={(params) => (
            <TextField name="departureDate" margin="normal" {...params} />
          )}
        />
        <DatePicker
          label="Return Date"
          mask="____/__/__"
          value={endDate}
          onChange={(value) => setEndDate(value ? value : '')}
          renderInput={(params) => (
            <TextField name="returnDate" margin="normal" {...params} />
          )}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: '1rem',
          }}
        >
          <TextField
            label="Number of Adults"
            name="adults"
            margin="normal"
            type="number"
            value={adults > 0 ? adults : ''}
            onChange={(e) => setAdults(Number(e.target.value))}
          />
          <TextField
            label="Number of Children"
            name="children"
            margin="normal"
            type="number"
            value={children > 0 ? children : ''}
            onChange={(e) => setChildren(Number(e.target.value))}
          />
        </Box>
        <Box>
          <Autocomplete
            multiple
            options={airports}
            value={selectedAirports}
            onChange={(event, value) => {
              setSelectedAirports(value);
            }}
            getOptionLabel={(option) => option.code}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination Airports"
                placeholder="Airport"
                margin="normal"
              />
            )}
          />

          <input
            style={{ display: 'none' }}
            name="airports"
            value={selectedAirports.map((airport) => airport.code).join(',')}
            readOnly
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: '1rem' }}>
        <Button
          variant="outlined"
          color="error"
          type="button"
          onClick={clearForm}
        >
          Clear
        </Button>
        <Button variant="contained" type="submit">
          Search
        </Button>
      </Box>
    </Form>
  );
}
