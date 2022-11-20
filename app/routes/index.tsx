import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { db } from '~/utils/db.server';
import { Link, useLoaderData, useTransition } from '@remix-run/react';
import React from 'react';
import { Hotel, Offer } from '@prisma/client';

type LoaderData = {
  hotels: Array<Hotel & { offers: Offer[] }>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const departuredate = url.searchParams.get('departureDate');
  const returndate = url.searchParams.get('returnDate');
  const countadults = url.searchParams.get('adults');
  const countchildren = url.searchParams.get('children');
  const airports = url.searchParams.get('airports');

  const airportsORCondition = airports?.length
    ? airports.split(',').map((airportCode) => ({
        inboundarrivalairport: airportCode,
      }))
    : undefined;

  const departureDate = departuredate ? new Date(departuredate) : null;

  const returnDate = returndate ? new Date(returndate) : null;

  let andCondition: any[] = [];

  if (departureDate && returnDate) {
    const departureEndDate = new Date(departureDate.getTime());
    const returnEndDate = new Date(returnDate.getTime());

    departureEndDate.setDate(departureEndDate.getDate() + 1);
    returnEndDate.setDate(returnEndDate.getDate() + 1);

    andCondition = [
      ...andCondition,
      {
        departuredate: {
          gte: departureDate,
          lte: departureEndDate,
        },
      },
      {
        returndate: {
          gte: returnDate,
          lte: returnEndDate,
        },
      },
    ];
  }

  const data: LoaderData = {
    hotels: await db.hotel.findMany({
      take: 20,
      include: {
        offers: {
          where: {
            countadults: countadults ? Number(countadults) : undefined,
            countchildren: countchildren ? Number(countchildren) : undefined,
            OR: airportsORCondition?.length ? airportsORCondition : undefined,
            AND: andCondition.length ? andCondition : undefined,
          },
        },
      },
    }),
  };

  return json(data);
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const [selectedHotel, setSelectedHotel] = React.useState(0);

  const hotels = data.hotels.filter((hotel) => hotel.offers.length);

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ mt: '1rem' }}>
        <Typography
          sx={{ borderBottom: 1, borderColor: '#ddd' }}
          variant="h5"
          color="primary"
          component="h2"
        >
          Offers
        </Typography>
        {transition.state === 'submitting' || transition.state === 'loading' ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress
              sx={{ mt: '2rem', mx: 'auto' }}
              color="secondary"
            />
          </Box>
        ) : hotels.length ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: '1rem',
              mt: '1rem',
            }}
          >
            {hotels.map((hotel) => (
              <HotelOffers
                key={hotel.id}
                hotel={hotel as any}
                isSelected={hotel.id === selectedHotel}
                onLoadClick={() => setSelectedHotel(hotel.id)}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: '2rem' }}>
            No Offers Available :(
          </Typography>
        )}
      </Box>
    </Box>
  );
}

interface HotelProps {
  hotel: Hotel & { offers: Offer[] };
  isSelected: boolean;
  onLoadClick: () => void;
}

function HotelOffers({ hotel, onLoadClick, isSelected }: HotelProps) {
  return (
    <Card>
      <CardHeader
        title={hotel.name}
        subheader={`${hotel.offers.length} offers available`}
        action={
          <Rating name="read-only" value={hotel.category_stars} readOnly />
        }
      />
      <CardContent>
        <Accordion>
          <AccordionSummary
            onClick={onLoadClick}
            aria-controls="panel1a-content"
            id="panel1a-header"
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>{`${hotel.offers.length} offers available!`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack divider={<Divider flexItem />} spacing={1}>
              {isSelected
                ? hotel.offers.map((offer: any, index) => (
                    <Offer key={index} offer={offer} />
                  ))
                : null}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}

interface OfferProps {
  offer: Offer;
}

function Offer({ offer }: OfferProps) {
  const departureDate = new Date(offer.departuredate);
  const returnDate = new Date(offer.returndate);

  let dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const descriptionTitleSx = { fontWeight: 'bold' };

  return (
    <Card elevation={0}>
      <CardContent>
        <Box component="dl" sx={{ display: 'flex', columnGap: '2rem' }}>
          <div>
            <Stack direction="row" spacing={1}>
              <Typography component="dt" sx={descriptionTitleSx}>
                Departure Date:
              </Typography>
              <Typography>
                {new Intl.DateTimeFormat('en-DE', dateOptions).format(
                  departureDate
                )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography component="dt" sx={descriptionTitleSx}>
                Return Date:
              </Typography>
              <Typography>
                {new Intl.DateTimeFormat('en-DE', dateOptions).format(
                  returnDate
                )}
              </Typography>
            </Stack>
          </div>

          <div>
            <Stack direction="row" spacing={1}>
              <Typography component="dt" sx={descriptionTitleSx}>
                Number of Adults:
              </Typography>
              <Typography>{offer.countadults}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography component="dt" sx={descriptionTitleSx}>
                Number of Children:
              </Typography>
              <Typography>{offer.countchildren}</Typography>
            </Stack>
          </div>

          <Stack direction="row" spacing={1}>
            <Typography component="dt" sx={descriptionTitleSx}>
              Price:
            </Typography>
            <Typography>
              {new Intl.NumberFormat('en-DE', {
                currency: 'EUR',
                style: 'currency',
              }).format(offer.price as any)}
            </Typography>
          </Stack>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to={`${offer.hotelid}`}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}
