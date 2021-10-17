import { Container } from 'inversify';
import { setupContainer } from './inversify.config';

const appContainer = new Container();
setupContainer(appContainer);

export default appContainer;
