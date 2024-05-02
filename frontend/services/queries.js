import { gql } from '@apollo/client';


export const GET_ALL_EVENTS = gql`
  query getAllEvents($search: String!, $limit: Int!, $offset:Int!) {
    getAllEvents(search: $search, limit:$limit, offset:$offset) {
        events {
            event_id,
            event_name,
            event_start_date,
            event_end_date,
            event_status
        },
        totalCount      
    }
  }
`;

export const GET_EVENT_DATA = gql`
  query getEvent($id: ID!) {
    getEvent(event_id: $id) {
        event_id, event_name, event_start_date, event_end_date, event_location, event_timezone,
        event_address1, event_address2, event_country, event_state, event_zip, event_description, 
        event_banner, event_thumbnail
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation deleteEvent($id: ID!) {
    deleteEvent(event_id: $id) {
      event_id
    }
  }
`;

export const CREATE_EVENT = gql`
    mutation CreateEvent($eventName: String!, $eventStartDate: String!, $eventEndDate: String!, $eventLocation: String!, $eventTimezone: String!, $eventAddress1: String!, $eventAddress2: String!, $eventCountry: String!, $eventState: String!, $eventZip: String!, $eventDescription: String!, $eventBanner: [String]!, $eventThumbnail: [String]!) {
        createEvent(input: {event_name:$eventName,event_start_date:$eventStartDate,event_end_date:$eventEndDate,event_location:$eventLocation,event_timezone:$eventTimezone,event_address1:$eventAddress1,event_address2:$eventAddress2,event_country:$eventCountry,event_state:$eventState,event_zip:$eventZip,event_description:$eventDescription,event_banner:$eventBanner,event_thumbnail:$eventThumbnail}) {
            event_id
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($id: ID!, $eventName: String!, $eventStartDate: String!, $eventEndDate: String!, $eventLocation: String!, $eventTimezone: String!, $eventAddress1: String!, $eventAddress2: String!, $eventCountry: String!, $eventState: String!, $eventZip: String!, $eventDescription: String!, $eventBanner: [String]!, $eventThumbnail: [String]!) {
        updateEvent(input: {event_id: $id, event_name:$eventName,event_start_date:$eventStartDate,event_end_date:$eventEndDate,event_location:$eventLocation,event_timezone:$eventTimezone,event_address1:$eventAddress1,event_address2:$eventAddress2,event_country:$eventCountry,event_state:$eventState,event_zip:$eventZip,event_description:$eventDescription,event_banner:$eventBanner,event_thumbnail:$eventThumbnail}) {
            event_id
        }
    }
`;

export const GET_ALL_ATTENDEES = gql`
  query getAllAttendees($search: String!, $limit: Int!, $offset:Int!) {
    getAllAttendees(search: $search, limit:$limit, offset:$offset) {
      attendees {
            attendee_id,
            first_name,
            last_name,
            email,
            phone,
            status
        },
        totalCount      
    }
  }
`;

export const GET_ATTENDEE_DATA = gql`
  query getAttendee($id: ID!) {
    getAttendee(attendee_id: $id) {
        attendee_id, first_name, last_name, email, company_name, status, title,
        address1, address2, country, state, zip, phone, profile_photo,
        banner
    }
  }
`;

export const DELETE_ATTENDEE= gql`
  mutation deleteAttendee($id: ID!) {
    deleteAttendee(attendee_id: $id) {
      attendee_id
    }
  }
`;

export const CREATE_ATTENDEE = gql`
    mutation CreateAttendee($firstName: String!, $lastName: String!, $email: String!, $companyName: String!, $status: String!, $title: String!, $address1: String!, $address2: String!, $country: String!, $state: String!, $zip: String!, $phone: String!, $profilePhoto: [String]!, $banner: [String]!) {
        createAttendee(input: {first_name:$firstName,last_name:$lastName,email:$email,company_name:$companyName,status:$status,title:$title,address1:$address1,address2:$address2,country:$country,state:$state,zip:$zip,phone:$phone,profile_photo:$profilePhoto, banner:$banner}) {
            attendee_id
        }
    }
`;

export const UPDATE_ATTENDEE = gql`
    mutation UpdateAttendee($id: ID!, $firstName: String!, $lastName: String!, $email: String!, $companyName: String!, $status: String!, $title: String!, $address1: String!, $address2: String!, $country: String!, $state: String!, $zip: String!, $phone: String!, $profilePhoto: [String]!, $banner: [String]!) {
        updateAttendee(input: {attendee_id: $id,first_name:$firstName,last_name:$lastName,email:$email,company_name:$companyName,status:$status,title:$title,address1:$address1,address2:$address2,country:$country,state:$state,zip:$zip,phone:$phone,profile_photo:$profilePhoto, banner:$banner}) {
            attendee_id
        }
    }
`;

export const GET_ALL_SPONSORS = gql`
  query getAllSponsors($search: String!, $limit: Int!, $offset:Int!) {
    getAllSponsors(search: $search, limit:$limit, offset:$offset) {
      sponsors {
            sponsor_id,
            contact_first_name,
            contact_last_name,
            contact_email,
            contact_phone,
            status
        },
        totalCount      
    }
  }
`;

export const GET_SPONSOR_DATA = gql`
  query getSponsor($id: ID!) {
    getSponsor(sponsor_id: $id) {
        sponsor_id, company_name, contact_title, contact_first_name, contact_last_name, contact_email, contact_phone, 
        address1, address2, country, state, zip, status, logo, banner
    }
  }
`;

export const DELETE_SPONSOR = gql`
  mutation deleteSponsor($id: ID!) {
    deleteSponsor(sponsor_id: $id) {
      sponsor_id
    }
  }
`;

export const CREATE_SPONSOR = gql`
    mutation CreateSponsor($companyName: String!, $title: String!, $firstName: String!, $lastName: String!, $email: String! ,$phone: String!, $address1: String!, $address2: String!, $country: String!, $state: String!, $zip: String!, $status: String!, $logo: [String]!, $banner: [String]!) {
        createSponsor(input: {company_name:$companyName,contact_title:$title, contact_first_name:$firstName,contact_last_name:$lastName,contact_email:$email,contact_phone:$phone, address1:$address1,address2:$address2,country:$country,state:$state,zip:$zip, status:$status, logo:$logo, banner:$banner}) {
            sponsor_id
        }
    }
`;

export const UPDATE_SPONSOR = gql`
    mutation UpdateSponsor($id: ID!, $companyName: String!, $title: String!, $firstName: String!, $lastName: String!, $email: String! ,$phone: String!, $address1: String!, $address2: String!, $country: String!, $state: String!, $zip: String!, $status: String!, $logo: [String]!, $banner: [String]!) {
        updateSponsor(input: {sponsor_id: $id,company_name:$companyName,contact_title:$title, contact_first_name:$firstName,contact_last_name:$lastName,contact_email:$email,contact_phone:$phone, address1:$address1,address2:$address2,country:$country,state:$state,zip:$zip, status:$status, logo:$logo, banner:$banner}) {
            sponsor_id
        }
    }
`;


export const GET_ALL_VENUES = gql`
  query getAllVenues($search: String!, $limit: Int!, $offset:Int!) {
    getAllVenues(search: $search, limit:$limit, offset:$offset) {
      venues {
            venue_id,
            contact_first_name,
            contact_last_name,
            contact_email,
            contact_phone,
            status
        },
        totalCount      
    }
  }
`;

export const GET_VENUE_DATA = gql`
  query getVenue($id: ID!) {
    getVenue(venue_id: $id) {
        venue_id, venue_name, company_name, contact_first_name, contact_last_name, contact_email, contact_phone, 
        address1, address2, country, state, zip, status, logo, banner
    }
  }
`;

export const DELETE_VENUE = gql`
  mutation deleteVenue($id: ID!) {
    deleteVenue(venue_id: $id) {
      venue_id
    }
  }
`;

export const CREATE_VENUE = gql`
    mutation CreateVenue($venueName: String!, $companyName: String!, $firstName: String!, $lastName: String!, $email: String! ,$phone: String!, $address1: String!, $address2: String!, $country: String!, $state: String!, $zip: String!, $status: String!, $logo: [String]!, $banner: [String]!) {
        createVenue(input: {venue_name:$venueName, company_name:$companyName,contact_first_name:$firstName,contact_last_name:$lastName,contact_email:$email,contact_phone:$phone, address1:$address1,address2:$address2,country:$country,state:$state,zip:$zip, status:$status, logo:$logo, banner:$banner}) {
            venue_id
        }
    }
`;

export const UPDATE_VENUE = gql`
    mutation UpdateVenue($id: ID!, $venueName: String!, $companyName: String!, $firstName: String!, $lastName: String!, $email: String! ,$phone: String!, $address1: String!, $address2: String!, $country: String!, $state: String!, $zip: String!, $status: String!, $logo: [String]!, $banner: [String]!) {
        updateVenue(input: {venue_id: $id,venue_name:$venueName, company_name:$companyName,contact_first_name:$firstName,contact_last_name:$lastName,contact_email:$email,contact_phone:$phone, address1:$address1,address2:$address2,country:$country,state:$state,zip:$zip, status:$status, logo:$logo, banner:$banner}) {
            venue_id
        }
    }
`;

export const UPLOAD_FILE = gql`
  mutation UploadFile($files: [UploadInput]!) {
    uploadFile(files: $files) {
      success
      message
      files
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(input: {email: $email, password:$password} ) {
        user {
            user_id,
            user_name,
            email
        },
        sessionId      
    }
  }
`;