import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatStringToDateTime } from '../utils/format-time.js';
import { Mode } from '../const.js';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';

const EMPTY_POINT = {
  basePrice: 100,
  dateFrom: new Date(),
  dateTo: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
  destination: '',
  destinationForPoint: {
    description: '',
    name: '',
    pictures: []
  },
  isFavorite: false,
  checkedOffersForPoint: [],
  type: 'flight',
  offers:[]
};


function createEditPointTemplate({ state, pointDestinations, pointOffers, mode }) {
  const { point } = state;

  const { basePrice, checkedOffersForPoint, destinationForPoint, dateFrom, dateTo, type, isSaving, isDeleting, isDisabled, isDisabledSubmit } = point;

  const neededPoint = pointOffers.find((pointOffer) => pointOffer.type === type);

  const destination = state.point.destinationForPoint;

  const neededOffers = neededPoint.offers;

  const hasOffersForType = neededOffers.length !== 0;
  const hideOffersSection = !hasOffersForType;

  const hideDesinationSection = !destination;
  const hideEventDetailsSection = hideOffersSection && hideDesinationSection;

  const getOfferCheckboxes = () => neededOffers.map((offer) => {

    const checked = checkedOffersForPoint.some((checkedOffer) => checkedOffer.id === offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer-id="${offer.id}"  id="event-offer-${offer.id}" ${isDisabled ? 'disabled' : ''}
        type="checkbox" name="event-offer-${offer.id}" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  }).join('');

  const imagesDestination = destinationForPoint.pictures.map((pictures) => `
  <img class="event__photo" src="${pictures.src}" alt="Event photo">`);

  let buttonText;
  if (isDeleting) {
    buttonText = 'Deleting...';
  } else if (mode === Mode.CREATING) {
    buttonText = 'Cancel';
  } else {
    buttonText = 'Delete';
  }


  return (
    `<li class="trip-events__item">
    <form class="event event--edit${isDisabled ? 'disabled' : ''}" action="#" method="post">
      <header class="event__header">

        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>

         <input class="event__type-toggle visually-hidden" ${isDisabled ? 'disabled' : ''} id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

        ${pointOffers.map((item) => `<div class="event__type-item">
          <input id="event-type-${item.type}" class="event__type-input visually-hidden"
            type="radio" name="event-type" value="${item.type}"
              ${item.type === type ? 'checked' : ''}>

          <label class="event__type-label event__type-label--${item.type}"
              for="event-type-${item.type}">${item.type}</label>
                </div>`)
      .join('')}
            </fieldset>
          </div>
        </div>


        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>


      <select class="event__input  event__input--destination"
      id="event-destination-1" name="event-destination">
               ${pointDestinations.map(({ name }) => (
      `<option value="${name}" ${destination?.name === name ? 'selected' : ''}>${name}</option>`))
      .join('')}

          </select>
        </div>


        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
           value="${formatStringToDateTime(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
           value="${formatStringToDateTime(dateTo)}">
        </div>


        <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1"
         type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled || isDisabledSubmit ? 'disabled' : ''}>
        ${isSaving ? 'Saving...' : 'Save'}</button>
       <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
       ${buttonText}</button>

          ${mode !== Mode.CREATING ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

 ${hideEventDetailsSection ? '' : `

    <section class="event__details">
${hideOffersSection ? '' : `

    <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">

${getOfferCheckboxes()}

    </div>
        </section>
`}


        ${hideDesinationSection ? '' : `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">${destinationForPoint.name}</h3>
          <p class="event__destination-description">${destinationForPoint.description}</p>

       ${(destinationForPoint.pictures.length) ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${imagesDestination}
            </div>
          </div>` : ''}

        </section>
 `}
      </section>
 `}
    </form>
  </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {

  #pointDestinations = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleCloseEditFormButton = null;
  #handleDeleteEditFormButton = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #mode;

  constructor(
    { point = EMPTY_POINT, pointDestinations, pointOffers, onFormSubmit,
      onCloseEditFormButton, onDeleteEditFormButton, mode = Mode.EDITING }) {
    super();

    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#mode = mode;
    this._setState(EditPointView.parsePointToState({point}));

    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseEditFormButton = onCloseEditFormButton;
    this.#handleDeleteEditFormButton = onDeleteEditFormButton;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
      mode: this.#mode
    });
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState({ point }),
    );
  }

  _restoreHandlers = () => {
    if (this.#mode === Mode.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditFormButtonHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelectorAll('.event__type-input').forEach((element) => {
      element.addEventListener('change', this.#typeInputClick);
    });

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputChange);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteEditFormButtonHandler);

    const offerBlock = this.element.querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHanlder);
    }
    this.#setDatepickers();
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        local: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      });

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),

      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        local: {
          firstDayOfWeek: 1
        },
        'time_24hr': true
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }
    });
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        isSaving: true,
        isDisabled: false
      }
    });
    this.updateElement(this._state);
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state.point));
  };

  #deleteEditFormButtonHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        isDeleting: true,
        isDisabled: false
      }
    });
    this.updateElement(this._state);
    this.#handleDeleteEditFormButton(EditPointView.parseStateToPoint(this._state.point));
  };

  #closeEditFormButtonHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseEditFormButton();
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    const newTypeOffers = this.#pointOffers.find((offer) => offer.type === evt.target.value)?.offers ?? [];

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        neededOffers: newTypeOffers,
        offers: []
      }
    });
  };

  #offerClickHanlder = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((offer) => offer.dataset.offerId);

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes,
        checkedOffersForPoint: this.#pointOffers
          .find((offer) => offer.type === this._state.point.type).offers
          .filter((offer) => checkedBoxes.includes(offer.id.toString()))
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: Number(evt.target.value)
      }
    });
    this.element.querySelector('.event__save-btn').disabled = false;
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations
      .find((destination) => destination.name === evt.target.value);

    if (selectedDestination) {
      const updatedDestinationForPoint = {
        ...selectedDestination,
      };

      this.updateElement({
        point: {
          ...this._state.point,
          destinationForPoint: updatedDestinationForPoint,
          destination: selectedDestination.id
        }
      });

    } else {
      this.updateElement({
        destinationForPoint: EMPTY_POINT.destinationForPoint,
        destination: null
      });
    }
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
    isDisabledSubmit: false
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    delete point.isDeleting;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDisabledSubmit;
    delete point.neededOffers;

    return point;
  };
}
