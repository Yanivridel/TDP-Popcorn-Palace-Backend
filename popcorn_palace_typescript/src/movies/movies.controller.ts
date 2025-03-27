import { Controller, Post, Body, Get, Put, Param, Delete, Patch } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Post()
    create(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.create(createMovieDto);
    }

    @Get('all')
    findAll() {
        return this.moviesService.findAll();
    }

    @Post('update/:id')
    async update(@Param('id') id: number, @Body() updateMovieDto: Partial<CreateMovieDto>) {
        return this.moviesService.update(id, updateMovieDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.moviesService.remove(id);
    }
}
