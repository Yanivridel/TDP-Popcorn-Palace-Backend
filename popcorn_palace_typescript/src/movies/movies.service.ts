import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movies.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {}

    async create(createMovieDto: CreateMovieDto): Promise<Movie> {
        const newMovie = this.movieRepository.create(createMovieDto);
        return await this.movieRepository.save(newMovie);
    }
    
    async findAll(): Promise<Movie[]> {
        return this.movieRepository.find();
    }

    async update(id: number, updateMovieDto: Partial<CreateMovieDto>): Promise<Movie> {
        const movie = await this.movieRepository.findOneBy({ id });
    
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }

        const updatedMovie = Object.assign(new CreateMovieDto(), movie, updateMovieDto);

        try {
            await validateOrReject(updatedMovie);
        } catch (errors) {
            throw new BadRequestException(errors);
        }
    
        Object.assign(movie, updateMovieDto);
        return this.movieRepository.save(movie);
    }

    async remove(id: number): Promise<void> {
        const movie = await this.movieRepository.findOneBy({ id });
    
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
    
        await this.movieRepository.remove(movie);
    }
}
