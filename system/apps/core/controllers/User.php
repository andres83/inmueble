<?php

class Core_Controller_User extends AdcpController {

    /**
     * Core User Model
     *
     * @var object
     */
    public $user;

    /**
     * Constructor
     *
     * Inits core user model and userid to use it in its methods
     */
    public function __construct() {
        parent::__construct();
        $this->user = new Core_Model_User;
    }

     /**
     * Gets user by userId, username, email, username | email
     *
     * @param mixed $userInfo ($getByField value)
     * @param string $getByField
     * @return array
     */
    public function getUser($userInfo, $getByField = 'id') {
        $user = $this->user->getUser($userInfo, $getByField);
        if (!$user) {
            echo Adcp::jsonEncode(
                array('errorMsg' => Adcp::translate('User account could not be found')),
                false
            );

            return;
        }

        echo Adcp::jsonEncode(array('user' => $user));
    }

    /**
     * Gets all users belong to an admin or get all users for super user
     *
     * @return string
     */
    public function getUsers() {
        $users = $this->user->getUsers();
        echo Adcp::jsonEncode(array('users' => $users));
    }

    /**
     * Create new system user
     *
     * @param array $user
     * @return void
     */
    public function createUser($user) {
        $this->user->createUser($user);
    }

    /**
     * Updates user's status (activated)
     *
     * @param int               $userId
     * @param string            $status
     */
    public function updateUserStatus($userId, $status) {
        $this->user->update(array('activated' => $status), "id = $userId");
	}

    /**
     * Deletes system user (only admin and super)
     *
     * @param int $userId
     */
    public function deleteUser($userId) {
        $this->user->deleteUser($userId);
    }

    /**
     * Update account
     *
     * @param array $user
     */
    public function updateAccount($user) {
        $email = $user['email'];
        $this->user->update(array('email' => $email), "id = {$this->_userId}");
    }

    /**
     * Change password
     *
     * @param string $old
     * @param string $new
     */
    public function changePassword($old, $new) {
		$this->user->changePassword($old, $new);
    }

    public function saveSettings($settings) {
        $this->user->saveSettings($settings);
    }
}