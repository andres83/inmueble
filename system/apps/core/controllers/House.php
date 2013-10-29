<?php

class Core_Controller_House extends AdcpController {

    /**
     * Core House Model
     *
     * @var object
     */
    public $house;

    /**
     * Constructor
     *
     * Inits core house model and houseid to use it in its methods
     */
    public function __construct() {
        parent::__construct();
        $this->house = new Core_Model_House;
    }

     /**
     * Gets house by houseId
     *
     * @param int $houseId
     * @return array
     */
    public function getHouse($houseId) {
    }

    /**
     * Gets all houses
     *
     * @return string
     */
    public function getHouses() {
        $this->house->getHouses();
    }

    /**
     * Create new system house
     *
     * @param array $house
     * @return void
     */
    public function createHouse($house,$neighborhood,$type,$day) {
        $this->house->createHouse($house,$neighborhood,$type,$day);
    }

    /**
     * Updates house's status (activated)
     *
     * @param int               $houseId
     * @param string            $status
     */
    public function updateHouse($houseId, $status) {
    }

    /**
     * Desactivate houses
     *
     * @param int $houseId
     */
    public function desactivateHouse($houseId) {
    }
}