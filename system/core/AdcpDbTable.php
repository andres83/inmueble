<?php

/**
 * Smart PHP Calendar
 *
 * @category   Adcp
 * @package    Core
 * @copyright  Copyright (c) 2008-2011 Yasin Dagli (http://www.smartphpcalendar.com)
 * @license    http://www.smartphpcalendar.com/license
 */

/**
 * AdcpDbTable is an object that acts as a Gateway to a database table.
 * One instance handles all the rows in the table.
 *
 * A Table Data Gateway holds all the SQL for accessing a single table or view:
 * selects, inserts, updates, and deletes. Other code calls its methods for all
 * interaction with the database.
 */
abstract class AdcpDbTable extends AdcpDb {
    protected $_userId;

    public function __construct($dbParams = null) {
        parent::__construct($dbParams);
        
        $this->_userId = defined('ADCP_USERID') ? ADCP_USERID : null;
    }
}