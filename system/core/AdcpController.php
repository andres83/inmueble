<?php

abstract class AdcpController {

    /**
     * Adcp Database
     *
     * @var object
     */
    protected $_db;

    /**
     * System UserID
     *
     * @var int
     */
    protected $_userId;

    public function __construct() {
        $this->_db = new AdcpDb;
        
        $this->_userId = defined('ADCP_USERID') ? ADCP_USERID : null;
    }
}