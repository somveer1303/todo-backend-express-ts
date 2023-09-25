import '@/utils/config.utils';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import UserRoute from '@routes/user.route';
import AuthRoute from '@routes/auth.route';
import TaskRoute from '@/routes/tasks.route';

const app = new App([new IndexRoute(), new AuthRoute(), new UserRoute(), new TaskRoute()]);

app.listen();
