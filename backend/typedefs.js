
const { gql } = require('apollo-server-express');

const typeDefs = gql`
   scalar Upload

   type User {
    user_id: ID
    user_name: String
    password: String!
    email: String!
    first_name: String!
    last_name: String!
   }

   type Event {
    event_id: ID!
    event_name: String!
    event_start_date: String!
    event_end_date: String!
    event_location: String!
    event_timezone: String!
    event_address1: String!
    event_address2: String!
    event_country: String!
    event_state: String!
    event_zip: String!
    event_description: String!
    event_banner: [String]
    event_thumbnail: [String]
    event_status: String!
  }

  type Attendee {
    attendee_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    company_name: String!
    title: String!
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!
    phone: String!
    profile_photo: [String]
    banner: [String]
    status: String!
  }

  type Sponsor {
    sponsor_id: ID!
    contact_title: String!
    company_name: String!
    contact_first_name: String!
    contact_last_name: String!
    contact_email: String!
    contact_phone: String!   
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!
    logo: [String]
    banner: [String]
    status: String!
  }
  
  type Venue {
    venue_id: ID!
    venue_name: String!
    company_name: String!
    contact_first_name: String!
    contact_last_name: String!
    contact_email: String!
    contact_phone: String!   
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!
    logo: [String]
    banner: [String]
    status: String!
  }

  input CreateUserInput {
    user_name: String!
    password: String!
    email: String!
    first_name: String!
    last_name: String!
  }
  
  input UpdateUserInput {
    user_id: ID!
    user_name: String!
    password: String
    email: String!
    first_name: String!
    last_name: String!
  }

  input CreateEventInput {
    event_name: String!
    event_start_date: String!
    event_end_date: String!
    event_location: String!
    event_timezone: String!
    event_address1: String!
    event_address2: String!
    event_country: String!
    event_state: String!
    event_zip: String!
    event_description: String!
    event_banner: [String]
    event_thumbnail: [String]
  }

  input UpdateEventInput {
    event_id: ID!
    event_name: String!
    event_start_date: String!
    event_end_date: String!
    event_location: String!
    event_timezone: String!
    event_address1: String!
    event_address2: String!
    event_country: String!
    event_state: String!
    event_zip: String!
    event_description: String!
    event_banner: [String]
    event_thumbnail: [String]
  }

  type EventConnection {
    events: [Event!]!
    totalCount: Int!
  }

  input CreateAttendeeInput {
    first_name: String!
    last_name: String!
    email: String!
    company_name: String!
    status: String!
    title: String!
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!
    phone: String!
    profile_photo: [String]
    banner: [String]
  }

  input UpdateAttendeeInput {
    attendee_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    company_name: String!
    status: String!
    title: String!
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!
    phone: String!
    profile_photo: [String]
    banner: [String]
  }

  type AttendeeConnection {
    attendees: [Attendee!]!
    totalCount: Int!
  }
  
  input CreateSponsorInput {
    company_name: String!    
    contact_title: String!
    contact_first_name: String!
    contact_last_name: String!
    contact_email: String!
    contact_phone: String!   
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!    
    status: String!
    logo: [String]
    banner: [String]
  }

  input UpdateSponsorInput {
    sponsor_id: ID!
    company_name: String!    
    contact_title: String!
    contact_first_name: String!
    contact_last_name: String!
    contact_email: String!
    contact_phone: String!   
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!    
    status: String!
    logo: [String]
    banner: [String]
  }

  type SponsorConnection {
    sponsors: [Sponsor!]!
    totalCount: Int!
  }
 
  input CreateVenueInput {
    venue_name: String!
    company_name: String!
    contact_first_name: String!
    contact_last_name: String!
    contact_email: String!
    contact_phone: String!   
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!    
    status: String!
    logo: [String]
    banner: [String]
  }

  input UpdateVenueInput {
    venue_id: ID!
    venue_name: String!
    company_name: String!
    contact_first_name: String!
    contact_last_name: String!
    contact_email: String!
    contact_phone: String!   
    address1: String!
    address2: String!
    country: String!
    state: String!
    zip: String!    
    status: String!
    logo: [String]
    banner: [String]
  }

  input UploadInput {
    uri: String
  }
  
  type UploadResponse {
    success: Boolean!
    message: String!
    files:[String]!
  }

  type VenueConnection {
    venues: [Venue!]!
    totalCount: Int!
  }

  
  input LoginInput {
    email: String!
    password: String!
  }
  
  type LoginPayload  {
    user: User!
    sessionId: String!
  }

  type Query {
    getUser(user_id: ID!): User
    getEvent(event_id: ID!): Event
    getAllEvents(search: String!, limit: Int!, offset: Int!): EventConnection!
    getAttendee(attendee_id: ID!): Attendee
    getAllAttendees(search: String!, limit: Int!, offset: Int!): AttendeeConnection!
    getSponsor(sponsor_id: ID!): Sponsor
    getAllSponsors(search: String!, limit: Int!, offset: Int!): SponsorConnection!
    getVenue(venue_id: ID!): Venue
    getAllVenues(search: String!, limit: Int!, offset: Int!): VenueConnection!
  }


  type Mutation {
    login(input: LoginInput!): LoginPayload!
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(user_id: ID!): User
    createEvent(input: CreateEventInput!): Event
    updateEvent(input: UpdateEventInput!): Event
    deleteEvent(event_id: ID!): Event
    createAttendee(input: CreateAttendeeInput!): Attendee
    updateAttendee(input: UpdateAttendeeInput!): Attendee
    deleteAttendee(attendee_id: ID!): Attendee
    createSponsor(input: CreateSponsorInput!): Sponsor
    updateSponsor(input: UpdateSponsorInput!): Sponsor
    deleteSponsor(sponsor_id: ID!): Sponsor
    createVenue(input: CreateVenueInput!): Venue
    updateVenue(input: UpdateVenueInput!): Venue
    deleteVenue(venue_id: ID!): Venue
    uploadFile(files: [UploadInput]!): UploadResponse!
  }
`;

module.exports=typeDefs;