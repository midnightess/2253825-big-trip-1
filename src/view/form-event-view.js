import AbstractView from '../framework/view/abstract-view.js';


function createEventsListTemplate() {

  return `
  <ul class="trip-events__list">`;
}


export default class FormEventView extends AbstractView {
  get template() {
    return createEventsListTemplate();
  }
}
