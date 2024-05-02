const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt =  require('bcrypt');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, 'uploads');

const userResolvers = {
  Query: {    
    getUser: async (_, { user_id }) => {
      try {       
        const user = await prisma.users.findUniqueOrThrow(
          {
            where: {
              user_id: parseInt(user_id)
            }            
          }
        )
        return user;
      } catch (error) {
        throw new Error('Failed to fetch user details');
      }
    },
    getEvent: async (_, { event_id }) => {
      try {
        const event = await prisma.events.findUniqueOrThrow(
          {
            where: {
              event_id: parseInt(event_id)
            }            
          }
        )
        return event;
      } catch (error) {
        throw new Error('Failed to fetch event details');
      }
    },
    getAllEvents: async (_, { search, limit, offset }) => {
      try {
        const events = await prisma.events.findMany(
          {
            where: {
              event_name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            orderBy: [
              {
                event_id: 'asc',
              },
            ],
            skip: parseInt(offset),
            take: parseInt(limit) 
          }
        );       

        const totalCount = await prisma.events.count({
          where: {
            event_name: {
              contains: search,
              mode: 'insensitive'
            },
          },
        });

        return {
          events,
          totalCount
        };
      } catch (error) {
        throw new Error('Failed to fetch events');
      }
    },

    getAttendee: async (_, { attendee_id }) => {
      try {
        const attendee = await prisma.attendees.findUniqueOrThrow(
          {
            where: {
              attendee_id: parseInt(attendee_id)
            }            
          }
        )
        return attendee;
      } catch (error) {
        throw new Error('Failed to fetch attendee details');
      }
    },
    getAllAttendees: async (_, { search, limit, offset }) => {
      try {
        const attendees = await prisma.attendees.findMany(
          {
            where: {
              first_name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            orderBy: [
              {
                attendee_id: 'asc',
              },
            ],
            skip: parseInt(offset),
            take: parseInt(limit) 
          }
        );       

        const totalCount = await prisma.attendees.count({
          where: {
            first_name: {
              contains: search,
              mode: 'insensitive'
            },
          },
        });

        return {
          attendees,
          totalCount
        };
      } catch (error) {
        throw new Error('Failed to fetch attendees');
      }
    },
    getSponsor: async (_, { sponsor_id }) => {
      try {
        const sponsor = await prisma.sponsors.findUniqueOrThrow(
          {
            where: {
              sponsor_id: parseInt(sponsor_id)
            }            
          }
        )
        return sponsor;
      } catch (error) {
        throw new Error('Failed to fetch sponsor details');
      }
    },
    getAllSponsors: async (_, { search, limit, offset }) => {
      try {
        const sponsors = await prisma.sponsors.findMany(
          {
            where: {
              contact_first_name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            orderBy: [
              {
                sponsor_id: 'asc',
              },
            ],
            skip: parseInt(offset),
            take: parseInt(limit) 
          }
        );       

        const totalCount = await prisma.sponsors.count({
          where: {
            contact_first_name: {
              contains: search,
              mode: 'insensitive'
            },
          },
        });

        return {
          sponsors,
          totalCount
        };
      } catch (error) {
        throw new Error('Failed to fetch sponsors');
      }
    },
    getVenue: async (_, { venue_id }) => {
      try {
        const venue = await prisma.venues.findUniqueOrThrow(
          {
            where: {
              venue_id: parseInt(venue_id)
            }            
          }
        )
        return venue;
      } catch (error) {
        throw new Error('Failed to fetch venue details');
      }
    },
    getAllVenues: async (_, { search, limit, offset }) => {
      try {
        const venues = await prisma.venues.findMany(
          {
            where: {
              contact_first_name: {
                contains: search,
                mode: 'insensitive'
              },
            },
            orderBy: [
              {
                venue_id: 'asc',
              },
            ],
            skip: parseInt(offset),
            take: parseInt(limit) 
          }
        );       

        const totalCount = await prisma.venues.count({
          where: {
            contact_first_name: {
              contains: search,
              mode: 'insensitive'
            },
          },
        });

        return {
          venues,
          totalCount
        };
      } catch (error) {
        throw new Error('Failed to fetch venues');
      }
    },
  },
  Mutation: {
    login: async (_, { input }) => {
      const { email, password } = input;
      const user = await prisma.users.findUnique({ where: { email } }); // Adjusted here
      if (!user) {
        throw new Error('User not found');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Invalid password');
      }
      const sessionId = uuidv4();
      return {
        user,
        sessionId: sessionId
      };
    },
    createUser: async (_, { input }) => {
      const { email, password, user_name, first_name, last_name } = input;
      const existingUser = await prisma.users.findUnique({ where: { email } }); // Adjusted here
      if (existingUser) {
        throw new Error('Email already exists');
      } 
      const hashedPassword = await bcrypt.hash(password, 10);   
      const user = await prisma.users.create({
          data:{
            email,
            password: hashedPassword,
            user_name,
            first_name,
            last_name
          }
        }
      )
      return user;
    },
    updateUser: async (_, { input }) => {
      const { user_id, email, password, user_name, first_name, last_name } = input;
      const existingUser  = await prisma.users.findUnique({ where: { email } }); 
      if (existingUser && existingUser.user_id !== parseInt(user_id)) {
        throw new Error('Email already exists');
      } 
      const hashedPassword = (password!=='') ? await bcrypt.hash(password, 10) : existingUser.password;      
      const user = await prisma.users.update({
          where: {
            user_id: parseInt(user_id)
          },
          data:{
            email,
            password: hashedPassword,
            user_name,
            first_name,
            last_name
          }
        }
      )
      return user;
    },
    deleteUser: async (_, { user_id }) => {
      try {
        const user = await prisma.users.delete({
          where: {
            user_id: parseInt(user_id)
          }
        })
        return user;
      } catch (error) {
        throw new Error('Failed to delete user');
      }
    },
    createEvent: async (_, { input }) => {
      try {
        const event = await prisma.events.create({
            data: input
          }
        )
        return event;
      } catch (error) {
        throw new Error('Failed to create event:',error);
      }
    },
    updateEvent: async (_, { input }) => {
      const { event_id, ...update } = input;
      try {
        const event = await prisma.events.update({
          where: {
            event_id: parseInt(event_id)
          },
          data: update
        })
        return event;
      } catch (error) {
        throw new Error('Failed to update event');
      }
    },
    deleteEvent: async (_, { event_id }) => {
      try {
        const event = await prisma.events.delete({
          where: {
            event_id: parseInt(event_id)
          }
        })
        return event;
      } catch (error) {
        throw new Error('Failed to delete event');
      }
    },
    createAttendee: async (_, { input }) => {
      try {
        const attendee = await prisma.attendees.create({
            data: input
          }
        )
        return attendee;
      } catch (error) {
        throw new Error('Failed to create attendee:',error);
      }
    },
    updateAttendee: async (_, { input }) => {
      const { attendee_id, ...update } = input;
      try {
        const attendee = await prisma.attendees.update({
          where: {
            attendee_id: parseInt(attendee_id)
          },
          data: update
        })
        return attendee;
      } catch (error) {
        throw new Error('Failed to update attendee');
      }
    },
    deleteAttendee: async (_, { attendee_id }) => {
      try {
        const attendee = await prisma.attendees.delete({
          where: {
            attendee_id: parseInt(attendee_id)
          }
        })
        return attendee;
      } catch (error) {
        throw new Error('Failed to delete attendee');
      }
    },
    createSponsor: async (_, { input }) => {
      try {
        const sponsor = await prisma.sponsors.create({
            data: input
          }
        )
        return sponsor;
      } catch (error) {
        throw new Error('Failed to create sponsor:',error);
      }
    },
    updateSponsor: async (_, { input }) => {
      const { sponsor_id, ...update } = input;
      try {
        const sponsor = await prisma.sponsors.update({
          where: {
            sponsor_id: parseInt(sponsor_id)
          },
          data: update
        })
        return sponsor;
      } catch (error) {
        throw new Error('Failed to update sponsor');
      }
    },
    deleteSponsor: async (_, { sponsor_id }) => {
      try {
        const sponsor = await prisma.sponsors.delete({
          where: {
            sponsor_id: parseInt(sponsor_id)
          }
        })
        return sponsor;
      } catch (error) {
        throw new Error('Failed to delete sponsor');
      }
    },
    createVenue: async (_, { input }) => {
      try {
        const venue = await prisma.venues.create({
            data: input
          }
        )
        return venue;
      } catch (error) {
        throw new Error('Failed to create venue:',error);
      }
    },
    updateVenue: async (_, { input }) => {
      const { venue_id, ...update } = input;
      try {
        const venue = await prisma.venues.update({
          where: {
            venue_id: parseInt(venue_id)
          },
          data: update
        })
        return venue;
      } catch (error) {
        throw new Error('Failed to update venue');
      }
    },
    deleteVenue: async (_, { venue_id }) => {
      try {
        const venue = await prisma.venues.delete({
          where: {
            venue_id: parseInt(venue_id)
          }
        })
        return venue;
      } catch (error) {
        throw new Error('Failed to delete venue');
      }
    },
    uploadFile: async (_, { files }) => {
      try {

        if (!Array.isArray(files)) {
          throw new Error('Invalid input. Images must be provided as an array.');
        }

        let uploadedFiles = [];
        // Validate each image object in the array
        files.forEach(file => {
          if (!file || typeof file.uri !== 'string') {
            throw new Error('Invalid input. Each image object must have a "uri" field of type string.');
          } else {
            const fileData = file.uri;
            const fileExt = fileData.split(';')[0].split('/')[1];

            // Decode base64 data        
            const fileBuffer = Buffer.from(fileData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
            const fileName = `${Date.now()}.${fileExt}`;
            
            // Save file to 'uploads' folder
            const filePath = path.join(UPLOAD_DIR, fileName);
            fs.writeFileSync(filePath, fileBuffer);

            uploadedFiles.push(fileName);
          }
        });

        return {
          success: true,
          message: 'File uploaded successfully',
          files:uploadedFiles
        };

      } catch (error) {
        console.error('Error uploading file:', error);
        return {
          success: false,
          message: 'Failed to upload file',
          filename: ''
        };
      }
    }
  },
};

module.exports = userResolvers;
