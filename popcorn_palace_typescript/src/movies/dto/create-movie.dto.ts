import { IsString, IsInt, IsDecimal, IsNotEmpty, Min, Max, IsNumber } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsInt()
    @Min(1)
    duration: number;

    @IsNumber({}, { message: 'Rating must be a number between 0 and 10' })
    @Min(0)
    @Max(10)
    rating: number;

    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear() + 5) // allow only release in 5 years
    release_year: number;
}
