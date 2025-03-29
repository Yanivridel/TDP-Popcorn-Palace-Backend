import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from './showtimes.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { Movie } from 'src/movies/movies.entity';
import { TicketsModule } from 'src/tickets/tickets.module';
import { Ticket } from 'src/tickets/ticket.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Showtime, Movie, Ticket]),
        MoviesModule,
        TicketsModule,
    ],
    controllers: [ShowtimesController],
    providers: [ShowtimesService],
})
export class ShowtimesModule {}
