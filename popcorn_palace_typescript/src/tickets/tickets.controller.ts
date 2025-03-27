import { Controller, Post, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('bookings')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Post()
    async bookTicket(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.bookTicket(createTicketDto);
    }
}
