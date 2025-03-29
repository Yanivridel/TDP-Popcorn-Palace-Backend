import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('Tickets (e2e)', () => {
    let app: INestApplication;
    let ticketId: string;
    let showtimeId: string;
    let movieId: string;
    let randomNumber = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create a movie
        const movieRes = await request(app.getHttpServer())
            .post('/movies')
            .send({
                title: "Test Movie",
                genre: "Action",
                duration: 120,
                rating: 7.5,
                releaseYear: 2023
            })
            .expect(201);
        movieId = movieRes.body.id;

        // Create a showtime for the movie
        const showtimeRes = await request(app.getHttpServer())
            .post('/showtimes')
            .send({
                movieId,
                theater: `IMAX Pop Hall ${randomNumber}`,
                startTime: "2025-06-01T12:30:00.000Z",
                endTime: "2025-06-01T20:30:00.000Z",
                price: 12.80
            })
            .expect(201);
        showtimeId = showtimeRes.body.id;
    });

    afterAll(async () => {
        if (showtimeId) {
            await request(app.getHttpServer()).delete(`/showtimes/${showtimeId}`).expect(200);
        }
        if (movieId) {
            await request(app.getHttpServer()).delete(`/movies/${movieId}`).expect(200);
        }
        await app.close();
    });

    it('should book a ticket successfully', async () => {
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .send({
                showtimeId,
                seatNumber: randomNumber,
                userId: uuidv4()
            })
            .expect(201);

        expect(res.body).toHaveProperty('bookingId');
        ticketId = res.body.bookingId;
    });

    it('should return an error when trying to book the same seat twice', async () => {
        // Try to book the same seat again
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .send({
                showtimeId,
                seatNumber: randomNumber,
                userId: uuidv4()
            })
            .expect(400);  // Expecting a Bad Request error because the seat is already booked

        expect(res.body.message).toBe(`Seat ${randomNumber} is already booked for this showtime.`);
    });

});
