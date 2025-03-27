import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Showtime } from './showtimes.entity';
import { Movie } from '../movies/movies.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import * as moment from 'moment';

@Injectable()
export class ShowtimesService {
    constructor(
        @InjectRepository(Showtime)
        private readonly showtimeRepository: Repository<Showtime>,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {}

    async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
        const { movieId, theater, startTime, endTime, price } = createShowtimeDto;

        const movie = await this.movieRepository.findOneBy({ id: movieId });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${movieId} not found`);
        }

        if (!moment(startTime, moment.ISO_8601, true).isValid()) {
            throw new BadRequestException(`Start time is not a valid ISO 8601 datetime`);
        }
        if (!moment(endTime, moment.ISO_8601, true).isValid()) {
            throw new BadRequestException(`End time is not a valid ISO 8601 datetime`);
        }

        // 🚨 Check for Overlapping Showtimes
        const overlappingShowtime = await this.showtimeRepository
            .createQueryBuilder("showtime")
            .where("showtime.theater = :theater", { theater })
            .andWhere("showtime.start_time < :end_time AND showtime.end_time > :start_time", {
                start_time: startTime,
                end_time: endTime,
            })
            .getOne();

        if (overlappingShowtime) {
            throw new BadRequestException(`Showtime overlaps with an existing showtime in theater: ${theater}`);
        }

        const newShowtime = this.showtimeRepository.create({
            movie,
            theater,
            startTime,
            endTime,
            price,
        });

        try {
            return await this.showtimeRepository.save(newShowtime);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new BadRequestException('Overlapping showtimes detected in the same theater');
            }
            throw error;
        }
    }

    async findOne(id: number): Promise<Showtime> {
        const showtime = await this.showtimeRepository.findOneBy({ id });
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }
        return showtime;
    }

    async update(id: number, updateShowtimeDto: Partial<CreateShowtimeDto>): Promise<Showtime> {
        const showtime = await this.showtimeRepository.findOneBy({ id });
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }

        const { movieId, theater, startTime, endTime, price } = updateShowtimeDto;

        // Only update fields that are provided in the request
        if (movieId) {
            const movie = await this.movieRepository.findOneBy({ id: movieId });
            if (!movie) {
                throw new NotFoundException(`Movie with ID ${movieId} not found`);
            }
            showtime.movie = movie;
        }

        if (startTime) {
            if (!moment(startTime, moment.ISO_8601, true).isValid()) {
                throw new BadRequestException(`Start time is not a valid ISO 8601 datetime`);
            }
            showtime.startTime = new Date(startTime);
        }

        if (endTime) {
            if (!moment(endTime, moment.ISO_8601, true).isValid()) {
                throw new BadRequestException(`End time is not a valid ISO 8601 datetime`);
            }
            showtime.endTime = new Date(endTime);
        }

        if (price) {
            showtime.price = price;
        }

        if (theater) {
            showtime.theater = theater;
        }

        // Ensure no overlapping showtimes after updating the fields
        const overlappingShowtime = await this.showtimeRepository
            .createQueryBuilder("showtime")
            .where("showtime.theater = :theater", { theater: showtime.theater })
            .andWhere("showtime.start_time < :end_time AND showtime.end_time > :start_time", {
                start_time: showtime.startTime,
                end_time: showtime.endTime,
            })
            .andWhere("showtime.id != :id", { id })
            .getOne();

        if (overlappingShowtime) {
            throw new BadRequestException(`Showtime overlaps with an existing showtime in theater: ${theater}`);
        }

        return await this.showtimeRepository.save(showtime);
    }

    async remove(id: number): Promise<{ message: string }> {
        const showtime = await this.showtimeRepository.findOneBy({ id });
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }

        await this.showtimeRepository.remove(showtime);
        return { message: `Showtime with ID ${id} successfully deleted` };
    }
}
