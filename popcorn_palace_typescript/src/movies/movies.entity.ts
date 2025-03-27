import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column()
    release_year: number;
}
