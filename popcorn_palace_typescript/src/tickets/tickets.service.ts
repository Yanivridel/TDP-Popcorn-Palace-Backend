import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Showtime } from '../showtimes/showtimes.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        @InjectRepository(Showtime)
        private readonly showtimeRepository: Repository<Showtime>,
    ) {}

    async bookTicket(createTicketDto: CreateTicketDto): Promise<{ bookingId: string }> {
        const { showtimeId, seatNumber, userId } = createTicketDto;

        // Check if the showtime exists
        const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
        if (!showtime) {
            throw new BadRequestException(`Showtime with ID ${showtimeId} not found`);
        }

        // Check if the seat is already booked
        const existingTicket = await this.ticketRepository.findOne({
            where: { showtime: { id: showtimeId }, seatNumber, isBooked: true },
        });
        if (existingTicket) {
            throw new BadRequestException(`Seat ${seatNumber} is already booked for this showtime.`);
        }

        const ticket = this.ticketRepository.create({
            showtime,
            seatNumber,
            userId,
            isBooked: true,
            bookingId: uuidv4()
        });

        await this.ticketRepository.save(ticket);

        return { bookingId: ticket.bookingId };
    }
}
