import { IsInt, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
    @IsInt()
    @IsNotEmpty()
    showtimeId: number;

    @IsInt()
    seatNumber: number;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
