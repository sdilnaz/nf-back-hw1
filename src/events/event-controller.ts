import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }




    // getEvents = async (req: Request, res: Response): Promise<void> => {
    //   try {
    //     const events = await this.eventService.getEvents();
    //     res.status(200).json(events);
    //   } catch (error: any) {
    //     res.status(500).send({ error: error.message });
    //   }
    // }

    getEvents = async (req: Request, res: Response): Promise<void> => {
      try {
        const { user } = req as any; // Extract user from request
        let events;
        if (user && user.location) { // If user is authorized and has a location
          const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
          const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 10;
          const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'date';
          const sortDirection = typeof req.query.sortDirection === 'string' ? req.query.sortDirection : 'asc';
          const userCity = user.location.split(',')[0].trim(); // Extract city from user's location
    
          events = await this.eventService.getEventsByCity(
            userCity,
            page,
            limit,
            sortBy,
            sortDirection
          );
        } else {
          events = await this.eventService.getEvents(); // Fetch all events
        }
        res.status(200).json(events);
      } catch (error: any) {
        res.status(500).send({ error: error.message });
      }
    }
    
    
    
  



    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;