import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { Movie } from '../movies/movies.entity';

@Entity("showtimes")
export class Showtime {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Movie, (movie) => movie.id, { eager: true }) // relation movie_id
    @JoinColumn({ name: 'movie_id' })
    movie: Movie;

    @Column()
    theater: string;

    @Column({ type: 'timestamp', name: "start_time" })
    startTime: Date;

    @Column({ type: 'timestamp', name: "end_time" })
    endTime: Date;

    @Column({ 
        type: 'decimal', 
        precision: 5, 
        scale: 2, 
        transformer: {
            to: (value: number): number => value,
            from: (value: string): number => parseFloat(value),
        }
    })
    price: number;
}
