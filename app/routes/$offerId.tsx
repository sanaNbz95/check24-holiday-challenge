import { json, LoaderFunction } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { useLoaderData } from '@remix-run/react';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Offer } from '@prisma/client';

type LoaderData = {
  offer: Offer;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const offer = await db.offer.findUnique({
    where: {
      id: Number(params.offerId),
    },
  });

  return json({ offer });
};

export default function OfferPage() {
  const { offer } = useLoaderData<LoaderData>();

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
    <Box sx={{ mt: '1rem' }}>
      <Typography
        sx={{ borderBottom: 1, borderColor: '#ddd' }}
        variant="h5"
        color="primary"
        component="h2"
      >
        Your Offer
      </Typography>
      <Card sx={{ mt: '1rem' }}>
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
      </Card>
    </Box>
  );
}
