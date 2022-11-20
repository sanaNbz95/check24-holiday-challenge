import { PrismaClient } from '@prisma/client';

const fs = require('node:fs');
import { parse } from 'csv-parse';

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    (
      await getJokes()
    ).map((hotel) => {
      return db.hotel.create({ data: hotel });
    })
  );

  await Promise.all(
    (
      await getOffers()
    ).map((offer) => {
      return db.offer.create({ data: offer });
    })
  );

  await Promise.all(
    (
      await getAirportCodes()
    ).map((airport) => {
      return db.airport.create({ data: airport });
    })
  );
}

seed();

async function getJokes() {
  let data: {
    id: any;
    name: any;
    latitude: any;
    longitude: any;
    category_stars: any;
  }[] = [];

  await fs
    .createReadStream('./prisma/hotels.csv')
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', function (row: any) {
      data = [
        ...data,
        {
          id: Number(row[0]),
          name: row[1],
          latitude: parseFloat(row[2]),
          longitude: parseFloat(row[3]),
          category_stars: Number(row[4]),
        },
      ];
    });

  await delay(5000);

  return data;
}

async function getOffers() {
  let data: any[] = [];

  await fs
    .createReadStream('./prisma/offers.csv')
    .pipe(parse({ delimiter: ',', from_line: 2, to_line: 20000 }))
    .on('data', function (row: any) {
      data = [
        ...data,
        {
          hotelid: Number(row[0]),
          departuredate: row[1],
          returndate: row[2],
          countadults: Number(row[3]),
          countchildren: Number(row[4]),
          price: row[5],
          inbounddepartureairport: row[6],
          inboundarrivalairport: row[7],
          outboundarrivalairport: row[8],
          outboundarrivaldatetime: row[9],
          mealtype: row[10],
          oceanview: Boolean(row[11]),
          roomtype: row[12],
        },
      ];
    })
    .on('end', () => {
      console.log('completed');
    });

  await delay(4000);

  return data;
}

async function getAirportCodes() {
  let data: any[] = [];

  await fs
    .createReadStream('./prisma/offers.csv')
    .pipe(parse({ delimiter: ',', from_line: 2, to_line: 20000 }))
    .on('data', function (row: any) {
      if (!data.find((item) => item.code === row[7])) {
        data = [
          ...data,
          {
            code: row[7],
          },
        ];
      }
    })
    .on('end', () => {
      console.log('completed');
    });

  await delay(4000);

  return data;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
