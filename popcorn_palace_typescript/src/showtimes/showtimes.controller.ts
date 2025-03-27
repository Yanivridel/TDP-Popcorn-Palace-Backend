import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
    constructor(private readonly showtimesService: ShowtimesService) {}

    @Post()
    create(@Body() createShowtimeDto: CreateShowtimeDto) {
        return this.showtimesService.create(createShowtimeDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.showtimesService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateShowtimeDto: Partial<CreateShowtimeDto>) {
        return this.showtimesService.update(id, updateShowtimeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.showtimesService.remove(id);
    }
}
