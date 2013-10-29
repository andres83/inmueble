<?php

class Core_Controller_Neighborhood extends AdcpController {

    /**
     * Core Neighborhood Model
     *
     * @var object
     */
    public $neighborhood;

    /**
     * Constructor
     *
     * Inits core neighborhood model and neighborhoodid to use it in its methods
     */
    public function __construct() {
        parent::__construct();
        $this->neighborhood = new Core_Model_Neighborhood;
    }

     /**
     * Gets neighborhood by neighborhoodId
     *
     * @param int $neighborhoodId
     * @return array
     */
    public function getNeighborhood($neighborhoodId) {
    }

    /**
     * Gets all neighborhoods
     *
     * @return string
     */
    public function getNeighborhoods($city) {
        $this->neighborhood->getNeighborhoods($city);
    }

    /**
     * Create new system neighborhood
     *
     * @param array $neighborhood
     * @return void
     */
    public function createNeighborhood($neighborhood, $city) {
        $this->neighborhood->createNeighborhood($neighborhood, $city);
    }

    /**
     * Updates neighborhood's status (activated)
     *
     * @param int               $neighborhoodId
     * @param string            $status
     */
    public function updateNeighborhood($neighborhoodId, $status) {
    }

    /**
     * Desactivate neighborhoods
     *
     * @param int $neighborhoodId
     */
    public function desactivateNeighborhood($neighborhoodId) {
    }
}