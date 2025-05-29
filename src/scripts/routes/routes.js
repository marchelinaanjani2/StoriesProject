import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add/add-story-page';
import DetailStoryPage from '../pages/detail/detail-page';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/about': AboutPage,
  '/add': AddStoryPage,
  '/detail/:id': DetailStoryPage,
};

export default routes;
