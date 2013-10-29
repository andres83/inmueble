<?php

class Core_Controller_Type extends AdcpController {

    /**
     * Core Type Model
     *
     * @var object
     */
    public $type;

    /**
     * Constructor
     *
     * Inits core type model and typeid to use it in its methods
     */
    public function __construct() {
        parent::__construct();
        $this->type = new Core_Model_Type;
    }

     /**
     * Gets type by typeId
     *
     * @param int $typeId
     * @return array
     */
    public function getType($typeId) {
    }

    /**
     * Gets all types
     *
     * @return string
     */
    public function getTypes() {
        $this->type->getTypes();
    }

    /**
     * Create new system type
     *
     * @param array $type
     * @return void
     */
    public function createType($type) {
        $this->type->createType($type);
    }

    /**
     * Updates type's status (activated)
     *
     * @param int               $typeId
     * @param string            $status
     */
    public function updateType($typeId, $status) {
    }

    /**
     * Desactivate types
     *
     * @param int $typeId
     */
    public function desactivateType($typeId) {
    }
}