import { render, replace } from '../framework/render.js';

import TripSortView from '../view/trip-sort-view.js';
import FormEventView from '../view/form-event-view.js';
import FormEditEvent from '../view/edit-event-view.js';
import PointListView from '../view/point-list-view.js';


export default class MainPresenter {
  #tripMainContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #tripSortComponent = new TripSortView();
  #tripEventsComponent = new FormEventView();

  #tripEventsPointList = [];


  constructor ({ tripMainContainer, destinationsModel, offersModel, pointsModel }) {
    this.#tripMainContainer = tripMainContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = [ ...pointsModel.points];
  }

  init () {
    render(this.#tripSortComponent, this.#tripMainContainer);
    render(this.#tripEventsComponent, this.#tripMainContainer);

    this.#renderPoints(this.#tripEventsPointList);
  }


  #renderPoints() {

    this.#pointsModel.forEach((point) => {
      this.#renderPoint(point);
    });
  }


  #renderPoint(point) {

    const pointList = new PointListView({
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),

      onEditClick: () => {
        replaceEditToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editEvent = new FormEditEvent({
      point: this.#pointsModel[0],
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,

      onCloseEditFormButton: () => {
        replacePointToEdit();
      },

      onFormSubmit: () => {
        replacePointToEdit();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });


    function escKeyDownHandler (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replacePointToEdit();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }


    function replaceEditToPoint() {
      replace(editEvent, pointList);
    }


    function replacePointToEdit() {
      replace(pointList, editEvent);
    }


    render(pointList, this.#tripEventsComponent.element);
  }
}

