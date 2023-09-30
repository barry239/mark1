import chalk from 'chalk';

// Database connection
import './db/connection';

// App config
import app from './app';

// Start server
app.listen(app.get('port'), () => {
    console.log(`Server on port: ${chalk.blueBright(app.get('port'))}`);
});
