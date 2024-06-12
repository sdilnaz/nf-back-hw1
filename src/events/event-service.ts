import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';



// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEvents(): Promise<IEvent[]> {
      return await EventModel.find().exec(); 
    }
    

    
  
    async getEventsByCity(
      location: string,
      page: number,
      limit: number,
      sortBy: string,
      sortDirection: string
    ): Promise<IEvent[]> {
      const skip = (page - 1) * limit;
      const sortOptions: { [key: string]: 1 | -1 } = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };
      return await EventModel.find({ location })
        .skip(skip)
        .limit(limit)
        .sort(sortOptions)
        .exec();
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }
    
  
    
    
  }
  
  
  export default EventService;
  