import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, useLoaderData,
} from '@remix-run/react';
import styles from './global.css';
import {AppBar, Box, Container, Paper, Toolbar, Typography} from '@mui/material';
import React from 'react';
import { SearchForm } from '~/components/search-form';
import { json, LoaderFunction } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { Airport, Hotel, Offer } from '@prisma/client';
import {ToggleColorScheme} from "~/components/toggle-color-scheme";

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export function links() {
  return [
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Lato&display=swap',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    },
  ];
}

type LoaderData = {
  airports: Array<Airport>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    airports: await db.airport.findMany(),
  };

  return json(data);
};

export default function App() {
  const data = useLoaderData<LoaderData>()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Box sx={{ height: '100%' }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Container sx={{ display: 'flex', alignItems: 'center' }} maxWidth="lg">
                <Typography sx={{ flex: '1 1 0%' }} variant="h6" color="inherit" component="h1">
                  Check24 Holiday Challenge!
                </Typography>
                <ToggleColorScheme />
              </Container>
            </Toolbar>
          </AppBar>
          <Container sx={{ mt: '1rem' }} maxWidth="lg">
            <Paper sx={{ display: 'flex', flexDirection: 'column', p: '1rem' }}>
              <SearchForm airports={data?.airports ?? []} />
            </Paper>
            <Outlet />
          </Container>
        </Box>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
