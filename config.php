<?php
/**
 * Maraton
 *
 * @category   Adcp
 * @package    Core
 */

//------------------------------------------------------------------------------
// Maraton system
//------------------------------------------------------------------------------

define('ADCP_VERSION', 'PRO'); //2.0.1

/**
 * Application environment
 * values: Titulo de la página
 */
define('ADCP_TITLE', 'Remate');

/**
 * Application environment
 * values: development | production
 */
define('ADCP_ENV', 'production');

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

//write your multiple modules by separating comma
//example: define('ADCP_MODULES', 'calendar,contacts,tasks');
define('ADCP_MODULES', 'calendar');

//------------------------------------------------------------------------------
// Plugins
//------------------------------------------------------------------------------

//write your multiple plugins by separating comma
//example: define('ADCP_PLUGINS', 'events_calendar,mobile_calendar');
define('ADCP_PLUGINS', 'events_calendar,mobile_calendar');

//------------------------------------------------------------------------------
// Domain Name and License Key
//------------------------------------------------------------------------------

// Exact calendar address
// example: http://yourhost.com/your-calendar-directory (without trailing slash)
define('ADCP_ROOT', 'http://localhost/maraton');
//define('ADCP_ROOT', 'http://miremate.tk');

// domain name | without protocol (http, https), www and subdomain
// example: yourhost.com
define('ADCP_DOMAIN', 'localhost');
//define('ADCP_DOMAIN', 'miremate');

define('ADCP_LICENSE_KEY', '19100M164I2828B3060F19100J23116K164Q1224S11104');

//------------------------------------------------------------------------------
// Database Configuration
//------------------------------------------------------------------------------

define('ADCP_DB_HOST', 'localhost');
define('ADCP_DB_USERNAME', 'root');
define('ADCP_DB_PASSWORD', '');
define('ADCP_DB_DBNAME', 'maraton');
/*define('ADCP_DB_HOST', 'mysql.nixiweb.com');
define('ADCP_DB_USERNAME', 'u734064900_root');
define('ADCP_DB_PASSWORD', 'Consuel0');
define('ADCP_DB_DBNAME', 'u734064900_remate');*/

//------------------------------------------------------------------------------
// Default timezone
//------------------------------------------------------------------------------

// when superuser or admin create user this will be user's default timezone
// users can change it in their calendar settings
define('ADCP_DEFAULT_TIMEZONE', 'America/Bogota');

//------------------------------------------------------------------------------
// Calendar Sharing
//------------------------------------------------------------------------------

//show input box or usernames dropdown menu in calendar sharing dialog

// none: text input box, you have to type username
// group: usernames dropdown menu that shows all usernames in a group
// all: usernames dropdown menu that shows all usernames

define('CAL_SHARE_SHOW_USERNAME', 'all');

//------------------------------------------------------------------------------
// Calendar Import/Export
//------------------------------------------------------------------------------

//ical default event privacy
// private: all imported events will be private
// public: all imported events will be public
define('ICAL_IMPORT_EVENT_PRIVACY', 'private');

//------------------------------------------------------------------------------
// Email and Popup Reminders
//------------------------------------------------------------------------------

//reminder count for each event
define('EVENT_REMINDER_COUNT', 10);

// use phpmailer for sending email notifications
// if false native PHP mail() function will be used
define('USE_PHP_MAILER', true);

define('EMAIL_REMINDER_FROM', 'noreply@smartphpcalendar.com');
define('EMAIL_REMINDER_SUBJECT', 'Smart PHP Calendar');

//PHP Mailer Configurations
//default configured for Gmail
define('PHP_MAILER_PROTOCOL', 'smtp');
define('PHP_MAILER_SECURITY', 'ssl');
define('PHP_MAILER_HOST', 'smtp.gmail.com');
define('PHP_MAILER_PORT', 465);
define('PHP_MAILER_USERNAME', '');
define('PHP_MAILER_PASSWORD', '');

//------------------------------------------------------------------------------
// Public View
//------------------------------------------------------------------------------

//show calendars on the left side
define('PUBLIC_VIEW_SHOW_CALS', true);