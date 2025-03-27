import { Showtime } from 'src/showtimes/showtimes.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity("movies")
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    genre: string;

    @Column()
    duration: number; // minutes

    @Column({
        type: 'decimal',
        precision: 2,
        scale: 1,
        transformer: {
            to: (value: number): number => value,
            from: (value: string): number => parseFloat(value),
        },
    })
    rating: number; // 0-10

    @Column({ name: "release_year" })
    releaseYear: number;

    @OneToMany(() => Showtime, (showtime) => showtime.movie)
    showtimes: Showtime[];
}
