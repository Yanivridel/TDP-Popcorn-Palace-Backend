import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Movies (e2e)', () => {
    let app: INestApplication;
    let movieId: string;  // Store the created movie ID

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        // Cleanup: Delete the created movie after tests
        if (movieId) {
            await request(app.getHttpServer()).delete(`/movies/${movieId}`);
        }
        await app.close();
    });

    it('should create a movie', async () => {
        const res = await request(app.getHttpServer())
            .post('/movies')
            .send({
                title: "The Dark Knight 3",
                genre: "Action",
                duration: 154,
                rating: 8.0,
                releaseYear: 2018
            })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        movieId = res.body.id;
    });

    it('should fetch all movies', async () => {
        const res = await request(app.getHttpServer()).get('/movies/all').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should delete the created movie', async () => {
        if (!movieId) {
            throw new Error('No movie ID found for deletion');
        }
        await request(app.getHttpServer())
            .delete(`/movies/${movieId}`)
            .expect(200);
    });
});
