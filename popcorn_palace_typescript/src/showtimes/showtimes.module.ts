import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './showtimes.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { Movie } from 'src/movies/movies.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Showtime, Movie]),
        MoviesModule,
    ],
    controllers: [ShowtimesController],
    providers: [ShowtimesService],
})
export class ShowtimesModule {}
