<?php

/**
 * Gets User Preferences
 */
class Core_Model_User extends AdcpDbTable {

    /**
     * adcp_users table
     *
     * @var string
     */
    protected $_name = 'users';

    /**
     * Inits application global constants
     */
    public function initAppConstants() {
        //define constants once for the whole application
        if (defined('ADCP_USERID')) {
            return;
        }

        //define some app global constants
        define('ADCP_USERID', Adcp::getUserPref('id'));
        define('ADCP_USERNAME', Adcp::getUserPref('username'));
        define('ADCP_USER_ROLE', Adcp::getUserPref('role'));
        define('ADCP_USER_EMAIL', Adcp::getUserPref('email'));
    }

    /**
     * Gets user by userId, username, email, username | email
     *
     * @param mixed $userInfo ($getByField value)
     * @param string $getByField
     * @return array
     */
    public function getUser($userInfo, $getByField = 'id') {
        $select = $this->select();

        switch ($getByField) {
            case 'id':
                $select->where("id = $userInfo");
                break;

            case 'username':
                $select->where("username = '$userInfo'");
                break;

            case 'email':
                $select->where("email = '$userInfo'");
                break;

            case 'username|email':
                $select->where("username = '$userInfo' OR email = '$userInfo'");
                break;
        }
        return $this->fetchRow($select);
    }

    /**
     * Insert new user
     *
     * @param array $user
     * @return type
     */
    public function createUser($user) {
		//check if the username exists
        $username = $user['username'];
        $select = $this->select(array("username"))
                        ->where("username = '$username'");
        if ($this->numRows($select) == 1) {
            throw new Exception('El usuario que introdujo no esta disponible!');
        }
        if (!filter_var($user['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('El correo que introdujo no es valido.');
        }

        $this->begin();

        $adcpLogin = new Core_Controller_Login;
        $user['password'] = $adcpLogin->hashPassword($username, $user['password']);
        
        $user['admin_id']=1;
        $user['role']="user";
        //insert new user
        $insertedUserId = $this->insert($user);
        $this->commit();
        
        $_SESSION['adcpUserLoggedIn'] = true;
        $_SESSION['ADCP_VERSION'] = ADCP_VERSION;

        //init user session
        $userModel = new Core_Model_User;
        $userModel->initAppConstants();
        return $insertedUserId;
    }

    /**
     * Change system password
     *
     * @param string $old
     * @param string $new
     */
    public function changePassword($old, $new) {
        $userId = ADCP_USERID;
        $username = ADCP_USERNAME;

        $adcpLogin = new Core_Controller_Login;

        $old = $adcpLogin->hashPassword($username, $old);
        $select = $this->select(array('id'))
                        ->where("id = $userId AND password = '$old'");

        if ($this->numRows($select) != 1) {
            throw new Exception('Error en contraseña antigua!');
        }

        $new = $adcpLogin->hashPassword($username, $new);
        $this->update(array('password' => $new), "id = $userId");
    }
}