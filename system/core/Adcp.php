<?php
/**
 * Maraton
 *
 * @category   Adcp
 * @package    Core
 */

/**
 * Core Application Class
 *
 * Holds global application methods and initializers
 */
class Adcp {

    private static $_sender;

    protected static $_dbConn;

    private static $_user;

    private static $_modules;

    private static $_plugins;

    private static $_translate;

    private static $_timezones;

    private static $_languages;

    private static $_themes;

    /**
     * Requires a file from modules
     *
     * @param string $filepath
     * @param string $module
     * @return mixed
     */
    public static function requireFile($filepath, $module) {
        return require ADCP_SYSPATH . '/apps/' . $module . '/' . $filepath;
    }

    public static function getDomain() {
        return ADCP_DOMAIN;
    }

    public static function getLicenseKey($plugin = null) {
        if ($plugin) {
            switch ($plugin) {
                case 'events_calendar':
                    return ADCP_EVENTS_CALENDAR_LICENSE_KEY;
                    break;

                case 'mobile_calendar':
                    return ADCP_MOBILE_CALENDAR_LICENSE_KEY;
                    break;

                default:
                    break;
            }
        }

        return ADCP_LICENSE_KEY;
    }

    public static function initApp() {
        if (!defined('ADCP_OUTPUT_BUFFER_OFF')) {
            ob_start();
        }

        session_start();

        //application modules (calendar, contacts, tasks, file-manager, etc.)
        self::$_modules = ADCP_MODULES ? explode(',', ADCP_MODULES) : array();

        //application plugins (events_calendar, mobile_calendar, etc.)
        self::$_plugins = ADCP_PLUGINS ? explode(',', ADCP_PLUGINS) : array();

        //run
        self::run();
    }

    public static function initAutoload() {
        require ADCP_SYSPATH . '/core/AdcpAutoLoader.php';
        $adcpAutoLoader = new AdcpAutoLoader;
        spl_autoload_register(array($adcpAutoLoader, 'autoloader'));
    }

    public static function run() {
        //init database to sanitize post
        new AdcpDb;

        //ajax engine run
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])
                && (strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) {

            /*self::setSender($_POST['sender']);
            if (self::getSender() === 'private') {
                self::checkLogin();
            }*/

            //if user is set define app global constants
            if (isset($_SESSION['adcpUserPrefs'])) {
                $userModel = new Core_Model_User;
                $userModel->initAppConstants();
            }

            $afc = new AdcpAjaxFrontController();
            $afc->dispatch();
        }
    }

    public static function checkLogin() {
        if (!isset($_SESSION['adcpUserLoggedIn'])
                || (isset($_SESSION['ADCP_VERSION']) && ($_SESSION['ADCP_VERSION'] != ADCP_VERSION))) {

            unset($_SESSION['adcpUserLoggedIn']);
            header('Location: ' . ADCP_ROOT . '/login.php');
            exit;
        }

        $userModel = new Core_Model_User;
        $userModel->initAppConstants();
    }
    
    public static function getUserPrefs() {
        return $_SESSION['adcpUserPrefs'];
    }

    public static function getUserPref($pref, $module = null) {
        //get module's preference
        if ($module) {
            if (isset($_SESSION['adcpUserPrefs'])) {
                return isset($_SESSION['adcpUserPrefs'][$module][$pref])
                       ? $_SESSION['adcpUserPrefs'][$module][$pref]
                       : false;
            }

            if (isset($_SESSION['adcpEventsCalUserPrefs'])) {
                return isset($_SESSION['adcpEventsCalUserPrefs'][$module][$pref])
                       ? $_SESSION['adcpEventsCalUserPrefs'][$module][$pref]
                       : false;
            }
        }

        //get core application preference
        if (isset($_SESSION['adcpUserPrefs'])) {
            return $_SESSION['adcpUserPrefs'][$pref];
        }

        if (isset($_SESSION['adcpEventsCalUserPrefs'])) {
            return $_SESSION['adcpEventsCalUserPrefs'][$pref];
        }
    }

    /**
     * Encodes variables to JSON string
     *
     * @param mixed         $v value
     * @param bool          $success
     * @return string       encoded json string
     */
    public static function jsonEncode($v = array(), $success = true) {
        $v['success'] = $success;

        if (version_compare(PHP_VERSION, '5.2.0', '<')) {
            require_once ADCP_SYSPATH . '/libs/JSON.php';
			$j = new Services_JSON();
            return $j->encode($v);
		}

		return json_encode($v);
    }

    public static function mb_ucfirst($str) {
		if (function_exists('mb_strtoupper')) {
			return mb_strtoupper(mb_substr($str, 0, 1, 'utf-8'), 'utf-8')
                   . mb_substr($str, 1, (mb_strlen($str, 'utf-8') - 1), 'utf-8');
		}

		return ucfirst($str);
	}

    public static function substr($str, $start, $lenght) {
        if (function_exists('mb_substr')) {
            return mb_substr($str, $start, $lenght, 'utf-8');
        }

        return substr($str, $start, $lenght);
    }

    public static function login($username) {
        //key for whole application login
        $_SESSION['adcpUserLoggedIn'] = true;
        $_SESSION['ADCP_VERSION'] = ADCP_VERSION;

        //init user session
        $userModel = new Core_Model_User;
        $_SESSION['adcpUserPrefs'] = $userModel->getUserPrefs(null, $username);
        $userModel->initAppConstants();

        //init user calendars
        AdcpCalendar::initUserCalendars();
    }
}