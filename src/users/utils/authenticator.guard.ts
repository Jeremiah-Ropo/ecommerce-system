import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new HttpException('No authorization header provided', HttpStatus.UNAUTHORIZED);
    }
    
    const token = authorizationHeader.split(' ')[1];
    try {
      // Verify token
      const payload = await this.jwtService.verifyAsync(token); 
      
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('You do not have permission to access this resource');
      }
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }
  }

}

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }
    
    const token = authorizationHeader.split(' ')[1];
    try {
      // Verify token
      const payload = await this.jwtService.verifyAsync(token); 
      
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      const { exp, iat, ...user } = payload;
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }
  }

}