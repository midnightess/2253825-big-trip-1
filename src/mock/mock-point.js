import { getRandomInteger } from '../utils/common.js';
import { Price } from './const.js';
import { getDate } from './utils.js';


function generatePoint (destinationId, offersId, type) {

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: destinationId,
    isFavorite: !!getRandomInteger(0, 1),
    offers: offersId,
    type
  };
}


export { generatePoint };
