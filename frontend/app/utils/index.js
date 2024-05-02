import moment from 'moment';

export const capitalizeWords = (str) => {
  // Split the string into an array of words
  const words = str.split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back into a single string
  return capitalizedWords.join(' ');
}

export const dateFormat = (dt) => {
  const date = (dt) ? moment(dt, 'MM-DD-YYYY HH:mm:ss').format('MMM DD, YYYY') : '';
  return date;
}

export const dateConversion = (dt) => {
  const date = new Date(dt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  return `${formattedMonth}/${formattedDay}/${year}`;
}

export const formatPhoneNumber = (str) => {
    // Filter only numbers from the input
    const cleaned = ('' + str).replace(/\D/g, '');

    // Check if the input is of proper length
    if (cleaned.length !== 10) {
      return str;
    }

    // Perform the formatting
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return str;
};

export const getNumber = (str) => {
  return ('' + str).replace(/\D/g, '');
}

export const trimValues = (values) => {
  const trimmedValues = {};
  Object.keys(values).forEach(key => {
    trimmedValues[key] = typeof values[key] === 'string' ? values[key].trim() : values[key];
  });
  return trimmedValues;
};

export const getQueryString = (obj) => {
  const queryString = Object.keys(obj)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
  .join('&');
  return queryString;
}