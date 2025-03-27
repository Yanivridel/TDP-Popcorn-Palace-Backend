import { Transform } from 'class-transformer';
import { IsString, IsInt, IsDecimal, IsNotEmpty, Min, Max, IsNumber, Matches } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    @Matches(/^[a-zA-Z0-9\s.,!?'"()-]+$/, { message: 'Title contains invalid characters' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Genre must contain only letters and spaces' })
    genre: string;

    @IsInt()
    @Min(1, { message: 'Duration must be at least 1 minute' })
    @Max(500, { message: 'Duration cannot exceed 500 minutes' }) 
    duration: number;

    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @IsInt()
    @Min(1888, { message: 'Movies release date must be after 1888' })
    @Max(new Date().getFullYear() + 5, { message: 'Release year cannot be more than 5 years in the future' })
    releaseYear: number;
}
