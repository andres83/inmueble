<?php

class Core_Controller_State extends AdcpController {

    /**
     * Core State Model
     *
     * @var object
     */
    public $state;

    /**
     * Constructor
     *
     * Inits core state model and stateid to use it in its methods
     */
    public function __construct() {
        parent::__construct();
        $this->state = new Core_Model_State;
    }

     /**
     * Gets state by stateId
     *
     * @param int $stateId
     * @return array
     */
    public function getState($stateId) {
    }

    /**
     * Gets all states
     *
     * @return string
     */
    public function getStates() {
        $this->state->getStates();
    }

    /**
     * Create new system state
     *
     * @param array $state
     * @return void
     */
    public function createState($state) {
        $this->state->createState($state);
    }

    /**
     * Updates state's status (activated)
     *
     * @param int               $stateId
     * @param string            $status
     */
    public function updateState($stateId, $status) {
    }

    /**
     * Desactivate states
     *
     * @param int $stateId
     */
    public function desactivateState($stateId) {
    }
}