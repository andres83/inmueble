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

/**
 * Application path
 */
define('ADCP_APP_DIR', dirname(__FILE__));

/**
 * System Path
 */
define('ADCP_SYSPATH', ADCP_APP_DIR . '/system');

/**
 * User config file
 */
require_once ADCP_APP_DIR . '/config.php';

/**
 * Default timezone for whole application
 */
date_default_timezone_set(ADCP_DEFAULT_TIMEZONE);

require_once ADCP_APP_DIR . '/system/core/Adcp.php';

Adcp::initAutoLoad();

$adcpError = new AdcpError();

Adcp::initApp();