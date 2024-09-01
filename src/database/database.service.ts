import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);

    connect() {
        this.logger.log('Connecting to the database...');
    }
}
