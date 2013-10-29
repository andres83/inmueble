<?php

class Core_Model_State extends AdcpDbTable {

    /**
     * adcp_users table
     *
     * @var string
     */
    protected $_name = 'states';
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
        $html = "
            <option value=''>
                -- Departamentos --
            </option>";
        
        $select = $this->select(array("id","state"))
                        ->where("activated = '1'")
                        ->order("state");
        $resourse = $this->fetchAll($select);
        foreach ($resourse as $state){
            $html .= "
            <option value='".$state['id']."'>
                ".$state['state']."
            </option>";
        }
        echo $html;
    }

    /**
     * Create new system state
     *
     * @param array $state
     * @return void
     */
    public function createState($state) {
        
        $select = $this->select(array("state"))
                        ->where("state = '$state'");
	if ($this->numRows($select) == 1) {
            echo ('Este departamento ya existe!');
            return;
	}

	$this->begin();

        $this->insert(array('activated'=>'1','state'=>$state));
        
        $this->commit();
        
        echo ('Este departamento se creo correctamente!');
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