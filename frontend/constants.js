export const apiUrl = 'http://localhost:8000/graphql';
export const itemsPerPage = 10;
export const eventBannerWidth = 2160;
export const eventBannerHeight = 1080;
export const eventThumbnailWidth = 1280;
export const eventThumbnailHeight = 720;
export const attendeeProfilePhotoWidth = 200;
export const attendeeProfilePhotoHeight = 200;
export const attendeeGalleryWidth = 400;
export const attendeeGalleryHeight = 400;
export const sponsorLogoWidth = 200;
export const sponsorLogoHeight = 200;
export const sponsorBrochureWidth = 400;
export const sponsorBrochureHeight = 400;

export const imageOptions = {
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 5,
};

export const zipMatching = /^[0-9]{5}(-[0-9]{4})?$/;
export const phoneNumberMatching = /^\(\d{3}\) \d{3}-\d{4}$/;
export const saveButtonLabel = 'Save';
export const noRecordsLabel = 'No Records Found';

export const zipFormatting = /[^0-9-]/g;
export const zipMaximumLength = 6;
export const phoneNumberMaximumLength = 14;
export const imagePickerCancelled = 'Image Picker Cancelled';
export const imagePickerError = 'Image Picker Error:';
export const imageTypeInvalidLabel = 'Invalid ';
export const imageTypeFormatLabel = ' format';
export const imageAllowedTypeLabel = 'Only JPG and PNG type ';
export const imageAllowedLabel = '  is allowed';
export const imageSizeExactlyLabel = ' must be exactly ';
export const imageSizePixlesLabel = ' pixles';
export const imageTypeMatching = /^data:(image\/[a-z]+);base64,/;
export const imageAllowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

export const emailLabel = 'Email';
export const passwordLabel = 'Password';

export const emailValidation = 'Email is Required';
export const passwordValidation = 'Password is Required';
export const emailMatchingValidation ='Invalid Email';

export const eventNameLabel= 'Event Name';
export const eventStartDateLabel= 'Event Start Date';
export const eventEndDateLabel= 'Event End Date';
export const eventLocationLabel= 'Event Location';
export const eventTimezoneLabel= 'Select a Event Timezone';
export const eventAddress1Label= 'Event Address 1';
export const eventAddress2Label= 'Event Address 2';
export const eventCountryLabel= 'Select a Event Country';
export const eventStateLabel= 'Event State';
export const eventZipLabel = 'Event Zip';
export const eventDescriptionLabel= 'Event Description';
export const eventBannerLabel = 'Upload Event Banner';
export const eventThumbnailLabel = 'Upload Event Thumbnail';

export const eventNameValidation = 'Event Name is Required';
export const eventStartDateValidation = 'Event Start Date is Required';
export const eventEndDateValidation = 'Event End Date is Required';
export const eventLocationValidation = 'Event Location is Required';
export const eventTimezoneValidation = 'Event Timezone is Required';
export const eventAddress1Validation = 'Event Address 1 is Required';
export const eventAddress2Validation = 'Event Address 2 is Required';
export const eventCountryValidation = 'Event Country is Required';
export const eventStateValidation = 'Event State is Required';
export const eventZipValidation  = 'Event Zip is Required';
export const eventDescriptionValidation = 'Event Description is Required';

export const attendeeFirstNameLabel = 'Attendee First Name';
export const attendeeLastNameLabel = 'Attendee Last Name';
export const attendeeEmailLabel = 'Attendee Email';
export const attendeeCompanyNameLabel = 'Company Name';
export const attendeeStatusLabel = 'Select a Status';
export const attendeeTitleLabel = 'Title';
export const attendeeAddress1Label = 'Address 1';
export const attendeeAddress2Label = 'Address 2';
export const attendeeCountryLabel = 'Select a Country';
export const attendeeStateLabel = 'State';
export const attendeeZipLabel  = 'Zip';
export const attendeePhoneLabel = 'Phone';
export const attendeeProfilePhotoLabel  = 'Upload Profile Photo';
export const attendeeBannerLabel  = 'Upload Banner';

export const attendeeFirstNameValidation = 'Attendee First Name is Required';
export const attendeeLastNameValidation = 'Attendee Last Name is Required';
export const attendeeEmailValidation = 'Attendee Email is Required';
export const attendeeEmailMatchingValidation ='Invalid Attendee Email';
export const attendeeCompanyNameValidation = 'Company Name is Required';
export const attendeeStatusValidation = 'Status is Required';
export const attendeeTitleValidation = 'Title is Required';
export const attendeeAddress1Validation = 'Address 1 is Required';
export const attendeeAddress2Validation = 'Address 2 is Required';
export const attendeeCountryValidation = 'Country is Required';
export const attendeeStateValidation = 'State is Required';
export const attendeeZipValidation  = 'Zip is Required';
export const attendeePhoneValidation = 'Phone Number is Required';
export const attendeePhoneMatchingValidation = 'Invalid Phone Number';

export const sponsorCompanyNameLabel = 'Company Name';
export const sponsorContactTitleLabel = 'Contact Title';
export const sponsorContactFirstNameLabel = 'Contact First Name';
export const sponsorContactLastNameLabel = 'Contact Last Name';
export const sponsorContactEmailLabel = 'Contact Email';
export const sponsorContactPhoneLabel = 'Contact Phone';
export const sponsorStatusLabel = 'Select a Status';
export const sponsorAddress1Label = 'Address 1';
export const sponsorAddress2Label = 'Address 2';
export const sponsorCountryLabel = 'Select a Country';
export const sponsorStateLabel = 'State';
export const sponsorZipLabel  = 'Zip';
export const sponsorLogoLabel  = 'Upload Logo';
export const sponsorBannerLabel  = 'Upload Banner';

export const sponsorCompanyNameValidation = 'Company Name is Required';
export const sponsorContactTitleValidation = 'Contact Title is Required';
export const sponsorContactFirstNameValidation = 'Contact First Name is Required';
export const sponsorContactLastNameValidation = 'Contact Last Name is Required';
export const sponsorContactEmailValidation = 'Contact Email is Required';
export const sponsorContactEmailMatchingValidation = 'Invalid Email';
export const sponsorContactPhoneValidation = 'Contact Phone is Required';
export const sponsorContactPhoneMatchingValidation = 'Invalid Phone Number';
export const sponsorStatusValidation = 'Status is Required';
export const sponsorAddress1Validation = 'Address 1 is Required';
export const sponsorAddress2Validation = 'Address 2 is Required';
export const sponsorCountryValidation = 'Country is Required';
export const sponsorStateValidation = 'State is Required';
export const sponsorZipValidation  = 'Zip is Required';

export const venueNameLabel = 'Venue Name';
export const venueCompanyNameLabel = 'Company Name';
export const venueContactFirstNameLabel = 'Contact First Name';
export const venueContactLastNameLabel = 'Contact Last Name';
export const venueContactEmailLabel = 'Contact Email';
export const venueContactPhoneLabel = 'Contact Phone';
export const venueStatusLabel = 'Select a Status';
export const venueAddress1Label = 'Address 1';
export const venueAddress2Label = 'Address 2';
export const venueCountryLabel = 'Select a Country';
export const venueStateLabel = 'State';
export const venueZipLabel  = 'Zip';
export const venueLogoLabel  = 'Upload Logo';
export const venueBannerLabel  = 'Upload Banner';

export const venueNameValidation = 'Venue Name is Required';
export const venueCompanyNameValidation = 'Company Name is Required';
export const venueContactFirstNameValidation = 'Contact First Name is Required';
export const venueContactLastNameValidation = 'Contact Last Name is Required';
export const venueContactEmailValidation = 'Contact Email is Required';
export const venueContactEmailMatchingValidation = 'Invalid Email';
export const venueContactPhoneValidation = 'Contact Phone is Required';
export const venueContactPhoneMatchingValidation = 'Invalid Phone Number';
export const venueStatusValidation = 'Status is Required';
export const venueAddress1Validation = 'Address 1 is Required';
export const venueAddress2Validation = 'Address 2 is Required';
export const venueCountryValidation = 'Country is Required';
export const venueStateValidation = 'State is Required';
export const venueZipValidation  = 'Zip is Required';
