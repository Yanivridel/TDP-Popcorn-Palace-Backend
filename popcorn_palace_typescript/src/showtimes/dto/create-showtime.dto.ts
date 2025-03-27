import { IsInt, IsNotEmpty, IsNumber, Min, Max, IsDateString, IsString } from 'class-validator';

export class CreateShowtimeDto {
    @IsInt()
    @IsNotEmpty()
    movieId: number;

    @IsString()
    @IsNotEmpty()
    theater: string;

    @IsDateString({}, { message: 'Start time must be a valid ISO 8601 date string' })
    startTime: string;

    @IsDateString({}, { message: 'End time must be a valid ISO 8601 date string' })
    endTime: string;

    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    price: number;
}
