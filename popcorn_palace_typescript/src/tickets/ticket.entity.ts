import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Showtime } from '../showtimes/showtimes.entity';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: "seat_number" })
    seatNumber: number;

    @ManyToOne(() => Showtime, showtime => showtime.id, { eager: true })
    @JoinColumn({ name: 'showtime_id' })
    showtime: Showtime;

    @Column({ name: "user_id" })
    userId: string;

    @Column({ default: false, name: "is_booked" })
    isBooked: boolean;

    @Column('uuid', { unique: true, name: "booking_id" })
    bookingId: string;  // UUID booking ID
}
