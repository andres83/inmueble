<?php

class Core_Controller_City extends AdcpController {

    /**
     * Core City Model
     *
     * @var object
     */
    public $city;

    /**
     * Constructor
     *
     * Inits core city model and cityid to use it in its methods
     */
    public function __construct() {
        parent::__construct();
        $this->city = new Core_Model_City;
    }

     /**
     * Gets city by cityId
     *
     * @param int $cityId
     * @return array
     */
    public function getCity($cityId) {
    }

    /**
     * Gets all cities
     *
     * @return string
     */
    public function getCities($state) {
        $this->city->getCities($state);
    }

    /**
     * Create new system city
     *
     * @param array $city
     * @return void
     */
    public function createCity($city,$state) {
        $this->city->createCity($city,$state);
    }

    /**
     * Updates city's status (activated)
     *
     * @param int               $cityId
     * @param string            $status
     */
    public function updateCity($cityId, $status) {
    }

    /**
     * Desactivate cities
     *
     * @param int $cityId
     */
    public function desactivateCity($cityId) {
    }
}