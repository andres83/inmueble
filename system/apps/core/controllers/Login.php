<?php

class Core_Controller_Login extends AdcpController {

    public $login;

    public function __construct() {
        parent::__construct();

        $this->login = new Core_Model_Login();
    }

    /**
     * Checks user login request, initializes application modules
     * and logs the user in the application
     *
     * @param string $username
     * @param string $password
     */
    public function checkLogin($username, $password) {
    	
        $hPassword = $this->login->hashPassword($username, $password);
        $user = $this->login->checkLogin($username, $hPassword);

		if (!$user) {
            echo Adcp::jsonEncode(
                array('errorMsg' => 'The username or password you entered is incorrect!')
                ,false
            );
        } else {
            if ($user['activated'] == '0') {
                echo Adcp::jsonEncode(
                    array('errorMsg' => 'Your account has not been activated. Please contact calendar administrator.')
                    ,false
                );
            } else {
                //key for whole application login
                $_SESSION['adcpUserLoggedIn'] = true;
                $_SESSION['ADCP_VERSION'] = ADCP_VERSION;

                //init user session
                $userModel = new Core_Model_User;
                $userModel->initAppConstants();

                //init user calendars
                //AdcpCalendar::initUserCalendars();
            }
        }
    }

    public function hashPassword($username, $password) {
		$salt = 'xQ._0_2' . md5($username[0] . $password . $username[(strlen($username) - 1)]);
		return hash('sha256', $salt . $password);
    }

    public function resetPass($email) {
        $this->login->resetPass($email);
    }

    public function logout() {
        session_destroy();
    }
}