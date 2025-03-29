import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Showtimes (e2e)', () => {
    let app: INestApplication;
    let showtimeId: string;
    let movieId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create a movie first (Showtime needs a movie)
        const movieRes = await request(app.getHttpServer())
            .post('/movies')
            .send({
                title: "Test Movie",
                genre: "Sci-Fi",
                duration: 120,
                rating: 7.5,
                releaseYear: 2023
            })
            .expect(201);
        movieId = movieRes.body.id;
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

    it('should create a showtime', async () => {
        const res = await request(app.getHttpServer())
            .post('/showtimes')
            .send({
                movieId,
                theater: "IMAX Pop Hall 1",
                startTime: "2025-05-01T12:30:00.000Z",
                endTime: "2025-05-01T20:30:00.000Z",
                price: 12.80
            })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        showtimeId = res.body.id;
    });

    it('should fetch showtime by id', async () => {
        const res = await request(app.getHttpServer()).get(`/showtimes/${showtimeId}`).expect(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should delete the created showtime', async () => {
        if (!showtimeId) {
            throw new Error('No showtime ID found for deletion');
        }
        else {
            await request(app.getHttpServer()).delete(`/showtimes/${showtimeId}`).expect(200);
            showtimeId = null;
        }
    });
});
