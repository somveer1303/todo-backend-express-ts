import '@/utils/config.utils';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import UserRoute from '@routes/user.route';
import AuthRoute from '@routes/auth.route';

const app = new App([new IndexRoute(), new AuthRoute(), new UserRoute()]);

app.listen();
